'use babel';

import { CompositeDisposable } from 'atom';
import { TextEditor } from 'atom';
// import { requirePackages } from 'atom-utils';

export default {

    config: {
        hideInactiveFiles: {
          type: 'object',
          properties: {
            hideFiles: {
              title: 'Distraction-Free Mode Test',
              description: 'Minimizes the opacity of inactive files',
              type: 'boolean',
              "default": false
            }
          }
        },
        hideGitStatus: {
          type: 'object',
          properties: {
            hideStatus: {
              title: 'Hide Git Status',
              description: 'Removes any coloring in tree-view related to file status',
              type: 'boolean',
              "default": false
            }
          }
        },
        themeColors: {
          title: 'Theme Colors',
          description: 'Comma Seperated List of filetypes and hex code colors',
          type: 'string',
          default: '.css:#4285F4,.js:#45B062,.gfm:#45B062,.php:#DD4A4A'
        },
    },

    activate: function(state) {
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(this.updateGrammar));
        this.subscriptions.add(atom.workspace.onDidAddPaneItem(this.treeListAddOpen));
        this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(this.treeListRemoveOpen));
        this.updateGrammar();

        atom.packages.activatePackage('tree-view').then(function(treeViewPkg){
            this.treeView = treeViewPkg.mainModule.createView();

            this.treeView.on('click', '.directory', (function(_this){
                return function(event){
                    items = atom.workspace.getPaneItems();

                    for (i = 0; i < items.length; i++) {
                        var item = items[i];
                        var filePath = item.getPath();
                        var entry = _this.treeView.entryForPath(filePath);
                        console.log( entry );
                        if( entry ){
                            entry.classList.add('open');
                        }
                    }
                };
            })(this));
        });

        var Options = require('./options');
        Options.apply();
    },

    updateGrammar: function(){
        var activeItem = atom.workspace.getActiveTextEditor();
        if( activeItem !== undefined ){
            document.body.setAttribute('active-grammar', activeItem.getGrammar().scopeName);
            activeItem.onDidChangeGrammar(function(){
                document.body.setAttribute('active-grammar', activeItem.getGrammar().scopeName);
            });
        } else {
            document.body.removeAttribute('active-grammar');
        }
    },

    treeListAddOpen: function(event){
        if( event.item instanceof TextEditor ){
            var filePath = event.item.getPath();
            var entry = this.treeView.entryForPath(filePath);
            if( entry ){
                entry.classList.add('open');
            }
        }
    },

    treeListRemoveOpen: function(event){
        if( event.item instanceof TextEditor ){
            var filePath = event.item.getPath();
            var entry = this.treeView.entryForPath(filePath);
            if( entry ){
                entry.classList.remove('open');
            }
        }
    },

    deactivate: function() {
        this.subscriptions.dispose();
    }

};