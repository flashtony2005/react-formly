/** @jsx React.DOM */
'use strict';

var React = require('react');
var fieldTypes = require('./FormlyConfig').fields.getTypes();

var Formly = React.createClass({displayName: 'Formly',
  onValueUpdate: function(fieldKey, value) {
    this.formly.model[fieldKey] = value;
    this.props.onFormlyUpdate(this.formly.model);
  },

  componentWillMount: function componentWillMount() {
    this.formly = {
      config: this.props.config,
      model: this.props.model
    };
  },
  render: function() {
    var model = this.formly.model;
    var onValueUpdate = this.onValueUpdate;
    var fields = this.formly.config.fields.map(function(field) {
      return generateFieldTag(field, model, onValueUpdate);
    });
    return React.DOM.form({name: "{this.formly.config.name}"}, fields);
  }
});

function generateFieldTag(field, model, onValueUpdate) {
  var fieldTag = fieldTypes[field.type];
  if (!fieldTag) {
    throw new Error('Formly: "' + field.type + '" has not been added to FormlyConfig\'s field types.');
  }

  // hidden
  var hide = isOrInvoke(field, 'hidden', model);
  if (!hide && hide !== null) {
    return null;
  }

  return fieldTag({model: model, config: field, onValueUpdate: onValueUpdate, key: field.key});
}

function isOrInvoke(field, property, model) {
  if (!field.hasOwnProperty(property)) {
    return null;
  }
  if (typeof field[property] === 'function') {
    return field[property](model, field);
  } else {
    return !!field[property];
  }
}

module.exports = Formly;