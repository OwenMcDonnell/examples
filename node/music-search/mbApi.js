const MusicBrainzApi = require('musicbrainz-api').MusicBrainzApi;


const url = "https://musicbrainz.org/ws/2";

const mbApi = new MusicBrainzApi({
    appName: 'node-demo-app',
    appVersion: '0.1.0',
    appContactInfo: 'britzkopf@gmail.com',
    baseUrl: 'https://musicbrainz.org'
});

async function queryArtists(p, searchString) {

    await p.send(`
        add spinner to=results at=0 id=searchspinner label="search executing"
    `) 
    
    let query = {};
    query['artist'] = searchString;

    let returnData = await mbApi.searchArtist(query, 0, 10);

    let returnArray = returnData['artists'];
    console.log(returnArray);
    
    /* ? why doesn't this work ? 
    
    returnArray.forEach(async element => {
        await p.send(`
            add text value="${element.name}"
        `)
    });*/
    
    // add
    // stack horizontal horizontalAlign='stretch'
    // stack minwidth='250px'
    //     nav
    //     item text='Group 1'
    //         item text='New'
    //         item key='email' text='Email message' icon='Mail'
    //         item key='calendar' text='Calendar event' icon='Calendar'
    //     item text='Group 2'
    //         item key=share text='Share' icon='Share'
    //         item key=twitter text='Share to Twitter'
    // stack width='100%' horizontal horizontalAlign='stretch'
    //     grid compact=false selection=none preserveSelection headerVisible=true
    //     columns
    //         column onClick name='File Type' icon=Page iconOnly fieldName='iconName' minWidth=20 maxWidth=20
    //         icon name=FileTemplate size=16
    //         column resizable sortable name='Name' fieldName='name'
    //         text value='{name}'
    //         column resizable name='Write' fieldName='write'
    //         stack horizontal height='100%' verticalAlign=center
    //             checkbox value='{write}'
    //         column resizable name='Color' fieldName='read'
    //         dropdown value='{color}' data='{key}'
    //             option key=red text='Red'
    //             option key=green text='Green'
    //             option key=blue text='Blue'
    //         column resizable sortable name='Description' fieldName='description'
    //         textbox value='{description}'
    //         column sortable=number name='Action' fieldName='key' minWidth=150
    //         stack horizontal height='100%' verticalAlign=center
    //             link url='{key}' value='{iconName}' visible=false
    //             link url='{key}' value='{name}' visible=false
    //             button icon='Edit' title='Edit todo' width=16 height=16 visible=true data='{key}'
    //             button icon='Delete' iconColor=red title='Delete todo' width=16 height=16 visible=true data='{key}'
    //     items id=gridItems
    //         item key=1 name='Item 1' iconName='ItemIcon1' description='Descr A'
    //         item key=2 name='Item 2' iconName='ItemIcon2' description='Descr B'
    //         item key=3 name='Item 3' iconName='ItemIcon3' description='Descr C'

    await p.send(`
        add 
            grid compact=false selection=none preserveSelection headerVisible=true
            columns
                column name='Name' fieldName='name' resizable sortable
                text value='{name}'
                column resizable sortable name='Type' fieldName='type'
                textbox value='{description}'
            items id=gridItems
    `)
    for (i=0; i < returnArray.length; i++) {
        // await p.send(`
        //  add to=gridItems
        //     item name="${returnArray[i].name}" description="${returnArray[i].type}"

        // `)
        await p.send(`
            add text to=results value="${returnArray[i].name}"
        `)
    }
    await p.send(`
        remove results:searchspinner
    `)

}

async function queryAlbums(p, searchString) {

    await p.send(`
        add spinner to=results id=searchspinner label="search executing"
    `) 

    let query = {};
    query['release-group'] = searchString;

    let returnData = await mbApi.searchReleaseGroup(query, 0, 10);
    console.log(returnData);
    let returnArray = returnData['release-groups'];       
    console.log(returnArray);

    
    for (i=0; i < returnArray.length; i++) {
        // let album = await queryAlbum(returnArray[i].id);
        // console.log("....album.....");
        // console.log(album);
        await p.send(`
                    add text to=results value="ALBUM:${returnArray[i].title} ARTIST:${returnArray[i]['artist-credit'][0].artist.name} RELEASE:${returnArray[i]['first-release-date']}"
        `)
    }
    await p.send(`
        remove results:searchspinner
    `)

}

async function queryAlbum(id) {

    const release = await mbApi.getReleaseGroup(id, ['artists']);
    return release;

}

module.exports = {
    queryArtists: queryArtists,
    queryAlbums: queryAlbums
}