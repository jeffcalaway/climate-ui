'use babel';

import fs from 'fs';

export default {
    apply: function(){
        htmlTag = document.documentElement;
        styleTimer = null;

//░░░░░░░░░░░░░░░░░░░░░░░░
//
//     DIRECTORY
//
//     _Colors
//       ∟EnableThemes
//       ∟ThemeColors
//     _TreeView
//       ∟HideGitStatus
//       ∟DistractionFree
//       ∟ShowOpenFiles
//       ∟CompactHeaders
//       ∟TreeViewTab
//
//░░░░░░░░░░░░░░░░░░░░░░░░

//▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// _Colors
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ∟DisableThemes
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

atom.config.onDidChange( 'climate-ui.acolors.enableThemes', function(){
    enableThemes(atom.config.get('climate-ui.acolors.enableThemes'));
});

//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ∟ThemeColors
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

var isHexCode = function(hexCode){
    return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hexCode);
}

var writeCustomStyles = function(colors, options){
    colors = colors.split(',');

    var custom = '';

    for (var i = 0; i < colors.length; i++) {
        color = colors[i];
        color = color.split(':');

        if( color.length == 2 && color[0] && color[1] && isHexCode(color[1]) ){
            custom += '.color-to-filetype("'+color[0]+'", '+color[1]+');\n';
        }
    }

    fs.writeFile(`${__dirname}/../styles/color-variances.less`, custom, 'utf8', () => {
        if (!options || !options.noReload) {
            var themePack = atom.packages.getLoadedPackage('climate-ui');

            if (themePack) {
                themePack.deactivate();
                setImmediate(() => themePack.activate());
            }
        }
    });
}

// writeCustomStyles(atom.config.get('climate-ui.acolors.themeColors'),{ noReload: true });

atom.config.onDidChange( 'climate-ui.acolors.themeColors', function(){
    var themeStatus = atom.config.get('climate-ui.acolors.enableThemes');

    if( themeStatus ){
        if( styleTimer ){
            clearTimeout(styleTimer);
        }
        styleTimer = setTimeout(function(){
            styleTimer = false;
            writeCustomStyles(atom.config.get('climate-ui.acolors.themeColors'));
        }, 1000);
    }
});

var enableThemes = function( themeStatus, options ){
    if( themeStatus === true ){
        writeCustomStyles(atom.config.get('climate-ui.acolors.themeColors'),options);
    }
    else{
        var fs = require('fs');
        fs.writeFile(`${__dirname}/../styles/color-variances.less`, '', function(){
            if (!options || !options.noReload) {
                var themePack = atom.packages.getLoadedPackage('climate-ui');

                if (themePack) {
                    themePack.deactivate();
                    setImmediate(() => themePack.activate());
                }
            }
        });
    }
}

enableThemes(atom.config.get('climate-ui.acolors.enableThemes'),{ noReload: true });


//▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// _TreeView
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ∟HideGitStatus
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

var hideGitStatus = function(hideStatus){
    if( hideStatus == 'Enabled [Dimmed]' ){
        htmlTag.classList.add('dim-git-status-in-tree-view');
        htmlTag.classList.remove('hide-git-status-in-tree-view');
    }
    else if( hideStatus == 'Enabled [Hidden]' ){
        htmlTag.classList.add('hide-git-status-in-tree-view');
        htmlTag.classList.remove('dim-git-status-in-tree-view');
    }
    else {
        htmlTag.classList.remove('hide-git-status-in-tree-view');
        htmlTag.classList.remove('dim-git-status-in-tree-view');
    }
}

hideGitStatus(atom.config.get('climate-ui.btreeView.ahideGitStatus'));

atom.config.onDidChange( 'climate-ui.btreeView.ahideGitStatus', function(){
    hideGitStatus(atom.config.get('climate-ui.btreeView.ahideGitStatus'));
});

//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ∟DistractionFree
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

var hideInactiveFiles = function(hideStatus){
    if( hideStatus == 'Enabled [Dark]' ){
        htmlTag.classList.add('hide-idle-tree-items');
        htmlTag.classList.remove('light-tree-on-hover');
    }
    else if( hideStatus == 'Enabled [Light]' ){
        htmlTag.classList.add('hide-idle-tree-items');
        htmlTag.classList.add('light-tree-on-hover');
    }
    else {
        htmlTag.classList.remove('hide-idle-tree-items');
        htmlTag.classList.remove('light-tree-on-hover');
    }
}

hideInactiveFiles(atom.config.get('climate-ui.btreeView.bhideInactiveFiles'));

atom.config.onDidChange( 'climate-ui.btreeView.bhideInactiveFiles', function(){
    hideInactiveFiles(atom.config.get('climate-ui.btreeView.bhideInactiveFiles'));
});

//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ∟ShowOpenFiles
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

var showOpenFiles = function(openFileStatus){
    if( openFileStatus === true ){
        htmlTag.classList.add('always-show-open-files-in-tree-view');
    }
    else{
        htmlTag.classList.remove('always-show-open-files-in-tree-view');
    }
}

showOpenFiles(atom.config.get('climate-ui.btreeView.cshowOpenFiles'));

atom.config.onDidChange( 'climate-ui.btreeView.cshowOpenFiles', function(){
    showOpenFiles(atom.config.get('climate-ui.btreeView.cshowOpenFiles'));
});

//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ∟CompactHeaders
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

var compactHeaders = function(boolean){
    if( boolean === true ){
        htmlTag.classList.add('compact-tree-view-headers');
    }
    else{
        htmlTag.classList.remove('compact-tree-view-headers');
    }
}

compactHeaders(atom.config.get('climate-ui.btreeView.dcompactHeaders'));

atom.config.onDidChange( 'climate-ui.btreeView.dcompactHeaders', function(){
    compactHeaders(atom.config.get('climate-ui.btreeView.dcompactHeaders'));
});

//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ∟TreeViewTab
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

var treeTab = function(boolean){
    var treeView = document.querySelector('.tree-view-resizer');

    if( treeView ){
        var treeTab = document.createElement('div');
        var title = document.createElement('span');
        var treeTabEl = treeView.querySelector('.tree-tab');

        if( treeTabEl ){
            treeView.removeChild(treeTabEl);
        }

        if( boolean === true ){
            treeTab.classList.add('tree-tab');
            treeTab.appendChild(title);
            treeView.insertBefore(treeTab, treeView.firstChild);
            htmlTag.classList.add('tree-tab-shadows');
        }
        else{
            htmlTag.classList.remove('tree-tab-shadows');
        }
    }
}

treeTab(atom.config.get('climate-ui.btreeView.etreeTab'));

atom.config.onDidChange( 'climate-ui.btreeView.etreeTab', function(){
    treeTab(atom.config.get('climate-ui.btreeView.etreeTab'));
});



}
};