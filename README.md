# liferay-hotfix-doc
A NodeJS wrapper for a service that reads a liferay hotfix documentation (contained in the file fixpack_documentation.xml) and converts it to JSON format without the need to download the entire hotfix.

## Installation
`npm i liferay-hotfix-doc`

## Usage

First, you have to instantiate the HotfixDoc object.

```
const hd = new HotfixDoc({
  user: 'my liferay.com user',
  password: 'my liferay.com password',
  server: 'the secret service url',
});
```

After that, you can use the exposed method `getDocumentation`. There are two ways of using it.
```
// To get hotfix-405-7010
// #1
hd.getDocumentation('405', '7010')
  .then(console.log)
  .catch(console.error);

// #2
hd.getDocumenation('405-7010')
  .then(console.log)
  .catch(console.error);
```

`getDocumentation` will return a native Promise.
The promise will
* resolve
    If the hotfix is found. Then its metadata as an object is returne as a value.
* reject
    If the hotfix is not found. An Error will be raised. The Error object will wrap a string (JSON format) containing error 404 and a message.
    If there is any other unrelated error.

# Result format
The result format will vary depending on the product version. You'll have to figure out how to find the information you need.  :)
Elements attributes are key-value pairs that can be accessed with `elementName.$`. Element value will be accessible with `elementName._`.
