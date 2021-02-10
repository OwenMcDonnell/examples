#!/usr/bin/env node

const axios = require('axios');
const parser = require('minimist');
const MusicBrainzApi = require('musicbrainz-api').MusicBrainzApi;
const pglet = require('pglet');
const mbApi = require('./mbApi.js');


const args = parser(process.argv.slice(2));

// const url = "https://musicbrainz.org/ws/2";

// const mbApi = new MusicBrainzApi({
//     appName: 'node-demo-app',
//     appVersion: '0.1.0',
//     appContactInfo: 'britzkopf@gmail.com',
//     baseUrl: 'https://musicbrainz.org'
// });

let query = {};
let result = {};

if ('artist' in args) {

    query['artist'] = "'" + args['artist'] + "'";
    mbApi.searchArtist(query, 0, 10).then((returnData) => {
        Object.assign(result, returnData);
    })

}

if ('album' in args) {

    query['album'] = "'" + args['album'] + "'";
    mbApi.searchRelease(query, 0, 10).then((returnData) => {
        Object.assign(result, returnData);
    })

}

(async () => {
    
    let p = await pglet.page();

    // await p.send(`
    //     add
    //     stack horizontal horizontalAlign='stretch'
    //         stack width='100%' horizontal horizontalAlign='stretch'
    //             grid compact=false selection=none preserveSelection headerVisible=true
    //                 columns
    //                     column onClick name='File Type' icon=Page iconOnly fieldName='iconName' minWidth=20 maxWidth=20
    //                         icon name=FileTemplate size=16
    //                     column resizable sortable name='Name' fieldName='name'
    //                         text value='{name}'
    //                     column resizable name='Write' fieldName='write'
    //                         stack horizontal height='100%' verticalAlign=center
    //                             checkbox value='{write}'
    //                     column resizable name='Color' fieldName='read'
    //                         dropdown value='{color}' data='{key}'
    //                             option key=red text='Red'
    //                             option key=green text='Green'
    //                             option key=blue text='Blue'
    //                     column resizable sortable name='Description' fieldName='description'
    //                         textbox value='{description}'
    //                     column sortable=number name='Action' fieldName='key' minWidth=150
    //                         stack horizontal height='100%' verticalAlign=center
    //                             link url='{key}' value='{iconName}' visible=false
    //                             link url='{key}' value='{name}' visible=false
    //                             button icon='Edit' title='Edit todo' width=16 height=16 visible=true data='{key}'
    //                             button icon='Delete' iconColor=red title='Delete todo' width=16 height=16 visible=true data='{key}'
    //                 items id=gridItems
    //                     item key=1 name='Item 1' iconName='ItemIcon1' description='Descr A'
    //                     item key=2 name='Item 2' iconName='ItemIcon2' description='Descr B'
    //                     item key=3 name='Item 3' iconName='ItemIcon3' description='Descr C'
    // `)

    await p.send(`
        add to=page at=0 text size=large bold=true value='Search MusicBrainz - The Open Music Encyclopedia' margin="1em 0em"
    `)

    await p.send(`
        add to=page at=1
        stack id=search width='100%' horizontal horizontalAlign='stretch' 
          textbox id=string label='Search for...' width='400px'
          dropdown id=dropdown label='By' width='200px'
            option key=artist text=artist
            option key=release text=album
          button id=button primary text=Search data=search_btn width=100px margin=2em        
    `)

    await p.send(`
        add to=page at=2
            text size=medium bold=true value='Search Results'
            stack id=spinner width=100% horizontal horizontalAlign='stretch'
            
            
    `)
    // await p.send(`
    //     add to=page at=3
    //         stack id=spinner width=100% horizontal horizontalAlign='stretch'
    // `)

    let searchType;
    while(true) {
        const e = await p.waitEvent();

        if (e._target == 'search:dropdown') {
            searchType = e._data;
        }

        if (e._target == 'search:button' && searchType == 'artist') {
            let searchString = await p.send(`
                get search:string value 
            `)
            await mbApi.queryArtists(p, searchString)          
        }

        if (e._target == 'search:button' && searchType == 'release') {
            let searchString = await p.send(`
                get search:string value 
            `)
            await mbApi.queryAlbums(p, searchString)            
        }

        console.log(e);
    }

})();


