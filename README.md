# bootstrap-signature-input

A jQuery plugin for using a signature field as form input, using default Bootstrap 4 styling. The signature and canvas magic is powered by szimek's excellent [Signature Pad](https://github.com/szimek/signature_pad).

## Installation
To install, use the following command:
```shell script
npm install @serabusinessdesign/bootstrap-signature-input
```

Next, include the JavaScript in your source file by adding a line at the top:
```javascript
require('@serabusinessdesign/bootstrap-signature-input')
```

Finally, add the Sass file to your source (depending on your setup):
```javascript
require('@serabusinessdesign/bootstrap-signature-input/src/scss/main.scss')
```
or
```scss
@import "~@serabusinessdesign/bootstrap-signature-input/src/scss/main";
```

## Usage

Using the signature input plugin is fairly straightforward. First, add an element to your HTML:
```html
<div data-toggle="signature" style="height: 150px">
    <input type="text" name="signature-1">
</div>
```
Then, add the following to your JS source:
```javascript
$(function () {
  $('[data-toggle=signature]').signature()
})
```
That's is!

You can optionally pass an options object, which is passed through to the signature_pad constructor. [See here for documentation](https://github.com/szimek/signature_pad#options). For example:
```javascript
$('[data-toggle=signature]').signature({
  penColor: 'blue'
})
```

## How it works

Internally, the plugin creates a new instance of signature_pad and the input field is hidden. Then, when you submit the form you put DOM element in, the point data is read from the canvas (using `signaturePad.toData()`) and inserted into the input element as a JSON encoded string. 
