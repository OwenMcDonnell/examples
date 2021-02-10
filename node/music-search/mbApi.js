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
        add spinner to=spinner id=searchspinner label="search executing"
    `) 
    
    let query = {};
    query['artist'] = searchString;
    let returnData = await mbApi.searchArtist(query, 0, 10);
    let returnArray = returnData['artists'];
    console.log(returnArray);  
    await p.send(`
        clean results:gridItems

    `)
    await p.send(`  
        add 
        stack width='100%' id=results
            grid compact=false selection=none preserveSelection headerVisible=true
                columns
                    column resizable sortable name='Name' fieldName='name' 
                        text value='{name}'
                    column resizable sortable name='Type' fieldName='type'
                        text value='{type}'
                    column resizable sortable name='Origin' fieldName='origin' 
                        text value='{origin}'
                    column resizable sortable name='Id' fieldName='artistId'
                        text value='{artistId}'
                items id=gridItems

    `)

    for (i=0; i < returnArray.length; i++) {

        await p.send(`
            add to=results:gridItems 
                item name="${returnArray[i].name}" type="${returnArray[i].type}" origin="${returnArray[i].country}" artistId="${returnArray[i].id}"
        `)
    }

    await p.send(`
        remove spinner:searchspinner
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