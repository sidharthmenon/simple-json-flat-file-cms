# Simple JSON Flat File CMS
Simple and dirty flat file CMS with data saved on JSON file.

# Editor
The editor gives a gui to edit the json format.

```json
{
  "contents":[
    {
      "id": "1",
      "display": "Page Name",
      "parent": "0",
      "hasChild": false,
      "hasContent": true,
      "content": "# Content",
      "order": "1",
      "icon": "1"
    },
  ],
  "config": {
    "title": "Website Title",
    "home": "1"
  }
}
```

The editor is made using VueJS and also incorporates a markdown editor called **[Writing](https://github.com/josephernest/writing/)** by josephernest to edit the contents.

# Sample Website
The json file saved from the editor can be utilised by any system to make the website.

An example of usage of the JSON file using VueJS is shown in the example-website folder.

In the example Vuejs is used to process the data and utilises **[vue-markdown](https://github.com/miaolz123/vue-markdown)** by miaolz123 is used to render the markdown content provided from the JSON file.

# Usage
You dont necessary have to host your own editor. You can Uitilise the editor that is hosted here: **[Editor](https://sidharthmenon.github.io/simple-json-flat-file-cms/)** to edit your json file.

Once you have the json file made you can either build your on code or use the one provided in example-website to iterate over the pages.
