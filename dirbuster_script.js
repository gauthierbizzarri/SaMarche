var dirBuster = require('dirbuster');

var options = {
    list: 'test.txt', // the word list you want to use, if none passed, it will use a random word generator
    outStream: process.stdout, // a stream that implements the Writable stream API
    url: 'https://google.com',
    export: 'json', // pick from the list: json, csv, xml, text
    methods: ['GET','POST','HEAD','PUT','DELETE'],
    recursive: false,
    depth: 2, // how many levels you want to go in your recursiveness
    throttle: 5, // how many concorrent requests
    extension: ['.php'] // if you want to look for specific extensions
};

dirBuster(options);