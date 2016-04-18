'use babel';

export default {
    apply: function(){
        root = document.documentElement

        var hideInactiveFiles = function(boolean){
            if( boolean ){
                root.classList.add('hide-idle-tree-items');
            } else {
                root.classList.remove('hide-idle-tree-items');
            }
        }

        hideInactiveFiles(atom.config.get('atom-alphabet-ui.hideInactiveFiles.hideFiles'));

        atom.config.onDidChange( 'atom-alphabet-ui.hideInactiveFiles.hideFiles', function(){
            hideInactiveFiles(atom.config.get('atom-alphabet-ui.hideInactiveFiles.hideFiles'));
        });
    }
};