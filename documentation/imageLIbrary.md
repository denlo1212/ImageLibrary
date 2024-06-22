# imageLibrary
---
imageLibrary is a singleton class meant for maneging the images provided in a folder specified.

in here we have 3 list witch are used to manage all the images throughout the application

```javascript
// can only have unique values 
this.uniqueTags = new Set();
// Don't change this list these are all the possible images that can be loaded in the application
this.backUpList = [];
//  this list can be modified and wil display whatever is in here
this.images = [];
```

the list will be filled with the class [Foto.js](../src/imageHandling/domain/foto.js)

if you ever need to reset the <span style="color: lightblue">this.images </span> list there is a restoreDefault() method.
which is why you are <span style="color:red;">NOT </span> allowed to modify the backUpList
<span style="color: green">except </span> for when new images get added or removed by the user. 
