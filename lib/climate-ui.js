'use babel';

import { CompositeDisposable } from 'atom';

export default {

    config: {
        acolors: {
            title: 'Colors',
            type: 'object',
            properties: {
                themeColors: {
                  title: 'Theme Colors',
                  description: 'Sets theme colors for specific file types (required format: ".filename:#FFFFFF")',
                  type: 'string',
                  default: '.css:#4285F4,.js:#45B062,.gfm:#45B062,.php:#DD4A4A'
                },
            }
        },
        btreeView: {
          title: 'Tree View',
          type: 'object',
          properties: {
              ahideInactiveFiles: {
                  title: "Distraction-Free Mode",
                  description: "Select a setting to minimize the opacity of inactive files",
                  type: "string",
                  enum: ["Disabled", "Enabled [Dark]", "Enabled [Light]"],
                  default: "Disabled"
              },
              bhideGitStatus: {
                  title: 'Hide Git Status',
                  description: 'Removes any coloring in tree-view related to file status',
                  type: "string",
                  enum: ["Disabled", "Dimmed", "Hidden"],
                  default: "Disabled"
              }
          }
        },
    },

    activate(state) {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(this.updateGrammar));
        this.subscriptions.add(atom.workspace.onDidAddPaneItem(this.treeListAddOpen));
        this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(this.treeListRemoveOpen));

        this.updateGrammar();

        var openItems = atom.workspace.getPaneItems();
        var entries = document.querySelectorAll('.entry');
        var TextEditor = require('atom').TextEditor;

        for (i = 0; i < openItems.length; i++) {
            var item = openItems[i];

            if( item instanceof TextEditor ){
                for (j = 0; j < entries.length; j++) {
                    var entry = entries[j];
                    if( entry.isPathEqual(item.getPath()) ){
                        entry.classList.add('open')
                    }
                }
            }

        }

        var Options = require('./options');
        Options.apply();
    },

    updateGrammar(){
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

    treeListAddOpen(event){

        var TextEditor = require('atom').TextEditor;
        if( event.item instanceof TextEditor ){

            var entries = document.querySelectorAll('.entry');

            for (i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if( entry.isPathEqual(event.item.getPath()) ){
                    entry.classList.add('open')
                }
            }

        }
    },

    treeListRemoveOpen(event){

        var TextEditor = require('atom').TextEditor;
        if( event.item instanceof TextEditor ){

            var entries = document.querySelectorAll('.entry');

            for (i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if( entry.isPathEqual(event.item.getPath()) ){
                    entry.classList.remove('open')
                }
            }
        }
    },

    deactivate() {
        this.subscriptions.dispose();
    }

};