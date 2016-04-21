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


        var hideGitStatus = function(boolean){
            if( boolean ){
                root.classList.add('hide-git-status-in-tree-view');
            } else {
                root.classList.remove('hide-git-status-in-tree-view');
            }
        }

        hideGitStatus(atom.config.get('atom-alphabet-ui.hideGitStatus.hideStatus'));

        atom.config.onDidChange( 'atom-alphabet-ui.hideGitStatus.hideStatus', function(){
            hideGitStatus(atom.config.get('atom-alphabet-ui.hideGitStatus.hideStatus'));
        });
    }
};