var Lang = Y.Lang,
    EVT_ADD = 'add',
    EVT_CLEAR = 'clear',
    EVT_REMOVE = 'remove';

var Tree = Y.Base.create('tree', Y.Base, [], {
    nodeClass: Y.Tree.Node,
    nodeExtensions: [],
    _isYUITree: true,
    _rootNodeConfig: {
        canHaveChildren: true
    },

    // -- Lifecycle ------------------------------------------------------------
    initializer: function(config) {
        config || (config = {});

        if (config.nodeClass) {
            this.nodeClass = config.nodeClass;
        }

        if (config.nodeExtensions) {
            this.nodeExtensions = this.nodeExtensions.concat(config.nodeExtensions);
        }

        this._published || (this._published = {});
        this._nodeMap = {};

        // Allow all extensions to initialize, then finish up.
        this.onceAfter('initializedChange', function() {
            this._composeNodeClass();

            this.clear(config.rootNode, {
                silent: true
            });

            if (config.nodes) {
                this.insertNode(this.rootNode, config.nodes, {
                    silent: true
                });
            }
        });
    },

    destructor: function() {
        this.destroyNode(this.rootNode, {
            silent: true
        });

        this.children = null;
        this.rootNode = null;
        this._nodeClass = null;
        this._nodeMap = null;
        this._published = null;
    },

    // -- Public Methods -------------------------------------------------------

    appendNode: function(parent, node, options) {
        return this.insertNode(parent, node, Y.merge(options, {
            index: parent.children.length,
            src: 'append'
        }));
    },

    clear: function(rootNode, options) {
        return this._fireTreeEvent(EVT_CLEAR, {
            rootNode: this.createNode(rootNode || this._rootNodeConfig),
            src: options && options.src
        }, {
            defaultFn: this._defClearFn,
            silent: options && options.silent
        });
    },

    createNode: function(config) {
        config || (config = {});

        // If `config` is already a node, just ensure it hasn't been destroyed
        // and is in the node map, then return it.
        if (config._isYUITreeNode) {
            if (config.state.destroyed) {
                Y.error('Cannot insert a node that has already been destroyed.', null, 'tree');
                return null;
            }

            this._adoptNode(config);
            return config;
        }

        // First, create nodes for any children of this node.
        if (config.children) {
            var children = [];

            for (var i = 0, len = config.children.length; i < len; i++) {
                children.push(this.createNode(config.children[i]));
            }

            config = Y.merge(config, {
                children: children
            });
        }

        var node = new this._nodeClass(this, config);

        return this._nodeMap[node.id] = node;
    },

    destroyNode: function(node, options) {
        var child, i, len;

        options || (options = {});

        for (i = 0, len = node.children.length; i < len; i++) {
            child = node.children[i];

            // Manually remove the child from its parent; this makes destroying
            // all children of the parent much faster since there's no splicing
            // involved.
            child.parent = null;

            // Destroy the child.
            this.destroyNode(child, options);
        }

        if (node.parent) {
            this.removeNode(node, options);
        }

        node.children = [];
        node.data = {};
        node.state = {
            destroyed: true
        };
        node.tree = null;
        node._indexMap = {};

        delete this._nodeMap[node.id];

        return this;
    },

    emptyNode: function(node, options) {
        var children = node.children,
            removed = [];

        for (var i = children.length - 1; i > -1; --i) {
            removed[i] = this.removeNode(children[i], options);
        }

        return removed;
    },

    findNode: function(node, options, callback, thisObj) {
        var match = null;

        // Allow callback as second argument.
        if (typeof options === 'function') {
            thisObj = callback;
            callback = options;
            options = {};
        }

        this.traverseNode(node, options, function(descendant) {
            if (callback.call(thisObj, descendant)) {
                match = descendant;
                return Tree.STOP_TRAVERSAL;
            }
        });

        return match;
    },

    getNodeById: function(id) {
        return this._nodeMap[id];
    },

    insertNode: function(parent, node, options) {
        options || (options = {});
        parent || (parent = this.rootNode);

        if ('length' in node && Lang.isArray(node)) {
            var hasIndex = 'index' in options,
                insertedNodes = [],
                insertedNode;

            for (var i = 0, len = node.length; i < len; i++) {
                insertedNode = this.insertNode(parent, node[i], options);

                if (insertedNode) {
                    insertedNodes.push(insertedNode);

                    if (hasIndex) {
                        options.index += 1;
                    }
                }
            }

            return insertedNodes;
        }

        node = this.createNode(node);

        if (node) {
            var index = options.index;

            if (typeof index === 'undefined') {
                index = this._getDefaultNodeIndex(parent, node, options);
            }

            this._fireTreeEvent(EVT_ADD, {
                index: index,
                node: node,
                parent: parent,
                src: options.src || 'insert'
            }, {
                defaultFn: this._defAddFn,
                silent: options.silent
            });
        }

        return node;
    },

    prependNode: function(parent, node, options) {
        return this.insertNode(parent, node, Y.merge(options, {
            index: 0,
            src: 'prepend'
        }));
    },

    removeNode: function(node, options) {
        options || (options = {});

        this._fireTreeEvent(EVT_REMOVE, {
            destroy: !!options.destroy,
            node: node,
            parent: node.parent,
            src: options.src || 'remove'
        }, {
            defaultFn: this._defRemoveFn,
            silent: options.silent
        });

        return node;
    },

    size: function() {
        return this.rootNode.size() + 1;
    },

    toJSON: function() {
        return this.rootNode.toJSON();
    },

    traverseNode: function(node, options, callback, thisObj) {
        if (node.state.destroyed) {
            Y.error('Cannot traverse a node that has been destroyed.', null, 'tree');
            return;
        }

        // Allow callback as second argument.
        if (typeof options === 'function') {
            thisObj = callback;
            callback = options;
            options = {};
        }

        options || (options = {});

        var stop = Tree.STOP_TRAVERSAL,
            unlimited = typeof options.depth === 'undefined';

        if (callback.call(thisObj, node) === stop) {
            return stop;
        }

        var children = node.children;

        if (unlimited || options.depth > 0) {
            var childOptions = unlimited ? options : {
                depth: options.depth - 1
            };

            for (var i = 0, len = children.length; i < len; i++) {
                if (this.traverseNode(children[i], childOptions, callback, thisObj) === stop) {
                    return stop;
                }
            }
        }
    },

    // -- Protected Methods ----------------------------------------------------

    _adoptNode: function(node, options) {
        var oldTree = node.tree,
            child;

        if (oldTree === this) {
            return;
        }

        for (var i = 0, len = node.children.length; i < len; i++) {
            child = node.children[i];

            child.parent = null; // Prevents the child from being removed from
            // its parent during the adoption.

            this._adoptNode(child, {
                silent: true
            });
            child.parent = node;
        }

        if (node.parent) {
            oldTree.removeNode(node, options);
        }

        delete oldTree._nodeMap[node.id];

        // If this node isn't an instance of this tree's composed _nodeClass,
        // then we need to recreate it to avoid potentially breaking things in
        // really weird ways.
        if (!(node instanceof this._nodeClass) || oldTree._nodeClass !== this._nodeClass) {

            node = this.createNode(node.toJSON());
        }

        node.tree = this;
        node._isIndexStale = true;

        this._nodeMap[node.id] = node;
    },

    _composeNodeClass: function() {
        var nodeClass = this.nodeClass,
            nodeExtensions = this.nodeExtensions,
            composedClass;

        if (typeof nodeClass === 'string') {
            // Look for a namespaced node class on `Y`.
            nodeClass = Y.Object.getValue(Y, nodeClass.split('.'));

            if (nodeClass) {
                this.nodeClass = nodeClass;
            } else {
                Y.error('Node class not found: ' + nodeClass, null, 'tree');
                return;
            }
        }

        if (!nodeExtensions.length) {
            this._nodeClass = nodeClass;
            return;
        }

        // Compose a new class by mixing extensions into nodeClass.
        composedClass = function() {
            var extensions = composedClass._nodeExtensions;

            nodeClass.apply(this, arguments);

            for (var i = 0, len = extensions.length; i < len; i++) {
                extensions[i].apply(this, arguments);
            }
        };

        Y.extend(composedClass, nodeClass);

        for (var i = 0, len = nodeExtensions.length; i < len; i++) {
            Y.mix(composedClass.prototype, nodeExtensions[i].prototype, true);
        }

        composedClass._nodeExtensions = nodeExtensions;
        this._nodeClass = composedClass;
    },

    _fireTreeEvent: function(name, facade, options) {
        if (options && options.silent) {
            if (options.defaultFn) {
                facade.silent = true; // intentionally modifying the facade
                options.defaultFn.call(this, facade);
            }
        } else {
            if (options && options.defaultFn && !this._published[name]) {
                this._published[name] = this.publish(name, {
                    defaultFn: options.defaultFn
                });
            }

            this.fire(name, facade);
        }

        return this;
    },

    _getDefaultNodeIndex: function(parent /*, node, options*/ ) {
        return parent.children.length;
    },

    _removeNodeFromParent: function(node) {
        var parent = node.parent,
            index;

        if (parent) {
            index = parent.indexOf(node);

            if (index > -1) {
                var children = parent.children;

                if (index === children.length - 1) {
                    children.pop();
                } else {
                    children.splice(index, 1);
                    parent._isIndexStale = true;
                }

                node.parent = null;
            }
        }
    },

    // -- Default Event Handlers -----------------------------------------------
    _defAddFn: function(e) {
        var index = e.index,
            node = e.node,
            parent = e.parent,
            oldIndex;

        // Remove the node from its existing parent if it has one.
        if (node.parent) {
            // If the node's existing parent is the same parent it's being
            // inserted into, adjust the index to avoid an off-by-one error.
            if (node.parent === parent) {
                oldIndex = parent.indexOf(node);

                if (oldIndex === index) {
                    // Old index is the same as the new index, so just don't do
                    // anything.
                    return;
                } else if (oldIndex < index) {
                    // Removing the node from its old index will affect the new
                    // index, so decrement the new index by one.
                    index -= 1;
                }
            }

            this.removeNode(node, {
                silent: e.silent,
                src: 'add'
            });
        }

        // Add the node to its new parent at the desired index.
        node.parent = parent;
        parent.children.splice(index, 0, node);

        parent.canHaveChildren = true;
        parent._isIndexStale = true;
    },

    _defClearFn: function(e) {
        var newRootNode = e.rootNode;

        if (this.rootNode) {
            this.destroyNode(this.rootNode, {
                silent: true
            });
        }

        this._nodeMap = {};
        this._nodeMap[newRootNode.id] = newRootNode;

        this.rootNode = newRootNode;
        this.children = newRootNode.children;
    },

    _defRemoveFn: function(e) {
        var node = e.node;

        if (e.destroy) {
            this.destroyNode(node, {
                silent: true
            });
        } else if (e.parent) {
            this._removeNodeFromParent(node);
        } else if (this.rootNode === node) {
            // Guess we'll need a new root node!
            this.rootNode = this.createNode(this._rootNodeConfig);
            this.children = this.rootNode.children;
        }
    }
}, {    
    STOP_TRAVERSAL: {}
});

Y.Tree = Y.mix(Tree, Y.Tree);