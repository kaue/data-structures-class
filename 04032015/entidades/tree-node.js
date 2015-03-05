function TreeNode(tree, config) {
    config || (config = {});

    this.id = this._yuid = config.id || this.id || Y.guid('treeNode-');
    this.tree = tree;

    this.children = config.children || [];
    this.data = config.data || {};
    this.state = config.state || {};

    if (config.canHaveChildren) {
        this.canHaveChildren = config.canHaveChildren;
    } else if (this.children.length) {
        this.canHaveChildren = true;
    }

    // Mix in arbitrary properties on the config object, but don't overwrite any
    // existing properties of this node.
    Y.mix(this, config);

    // If this node has children, loop through them and ensure their parent
    // references are all set to this node.
    for (var i = 0, len = this.children.length; i < len; i++) {
        this.children[i].parent = this;
    }
}

TreeNode.prototype = {
    _isIndexStale: true,
    _isYUITreeNode: true,
    _serializable: ['canHaveChildren', 'data', 'id', 'state'],
    
    
    append: function(node, options) {
        return this.tree.appendNode(this, node, options);
    },

    depth: function() {
        if (this.isRoot()) {
            return 0;
        }

        var depth = 0,
            parent = this.parent;

        while (parent) {
            depth += 1;
            parent = parent.parent;
        }

        return depth;
    },

    empty: function(options) {
        return this.tree.emptyNode(this, options);
    },

    find: function(options, callback, thisObj) {
        return this.tree.findNode(this, options, callback, thisObj);
    },
    
    hasChildren: function() {
        return !!this.children.length;
    },
    
    index: function() {
        return this.parent ? this.parent.indexOf(this) : -1;
    },

    indexOf: function(node) {
        var index;

        if (this._isIndexStale) {
            this._reindex();
        }

        index = this._indexMap[node.id];

        return typeof index === 'undefined' ? -1 : index;
    },
  
    insert: function(node, options) {
        return this.tree.insertNode(this, node, options);
    },

    isInTree: function() {
        if (this.tree && this.tree.rootNode === this) {
            return true;
        }

        return !!(this.parent && this.parent.isInTree());
    },

    isRoot: function() {
        return !!(this.tree && this.tree.rootNode === this);
    },

    next: function() {
        if (this.parent) {
            return this.parent.children[this.index() + 1];
        }
    },

    prepend: function(node, options) {
        return this.tree.prependNode(this, node, options);
    },

    previous: function() {
        if (this.parent) {
            return this.parent.children[this.index() - 1];
        }
    },

    remove: function(options) {
        return this.tree.removeNode(this, options);
    },

    size: function() {
        var children = this.children,
            len = children.length,
            total = len;

        for (var i = 0; i < len; i++) {
            total += children[i].size();
        }

        return total;
    },

    toJSON: function() {
        var obj = {},
            state = this.state,
            i, key, len;

        // Do nothing if this node is marked as destroyed.
        if (state.destroyed) {
            return null;
        }

        // Serialize properties explicitly marked as serializable.
        for (i = 0, len = this._serializable.length; i < len; i++) {
            key = this._serializable[i];

            if (key in this) {
                obj[key] = this[key];
            }
        }

        // Serialize child nodes.
        if (this.canHaveChildren) {
            obj.children = [];

            for (i = 0, len = this.children.length; i < len; i++) {
                obj.children.push(this.children[i].toJSON());
            }
        }

        return obj;
    },

    traverse: function(options, callback, thisObj) {
        return this.tree.traverseNode(this, options, callback, thisObj);
    },

    // -- Protected Methods ----------------------------------------------------
    _reindex: function() {
        var children = this.children,
            indexMap = {},
            i, len;

        for (i = 0, len = children.length; i < len; i++) {
            indexMap[children[i].id] = i;
        }

        this._indexMap = indexMap;
        this._isIndexStale = false;
    }
};

module.exports = TreeNode;