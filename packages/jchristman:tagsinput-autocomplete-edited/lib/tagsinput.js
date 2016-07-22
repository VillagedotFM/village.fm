TagsInput = {};

Tags = new ReactiveDict('_taginput_autocomplete');

Template.tagsinput.helpers({
    setup : function() {
        // if (this.atts !== undefined) { // Then this was called from AutoForm
        //     this.data_schema_key = this.atts["data-schema-key"]; delete this.atts["data-schema-key"];
        //     this.autocompleteSettings = this.atts.autocompleteSettings; delete this.atts.autocompleteSettings;
        //     this.tagField = this.atts.tagField; delete this.atts.tagField;
        //     this.tagId = this.atts.tagId; delete this.atts.tagId;
        //     this.tagClass = this.atts.tagClass; delete this.atts.tagClass;
        //     this.tagName = this.atts.tagName; delete this.atts.tagName;
        //     this.tagPlaceholder = this.atts.tagPlaceholder; delete this.atts.tagPlaceholder;
        // }
        // if (this.tagField == undefined) throw Meteor.Error(502, 'Must define the tagField');
        // if (this.tagId == undefined) throw Meteor.Error(502, 'Must define the tagId');
        if (this.tagClass == undefined) this.tagClass = 'label label-default';
        // if (this.tagName == undefined) this.tagName = '';
        // if (this.tagPlaceholder == undefined) this.tagPlaceholder = '';

        if (this.value === "") {
            Tags.set(this.tagId,[]);
        } else {
            Tags.set(this.tagId,this.value);
        }

        return this;
    },

    currentTags : function() {
        return Tags.get('taggedUsers');
    },

    getField : function() {
        return this[Template.parentData(1).tagField];
    }
});

Template.tagsinput.events({
    'autocompleteselect .tagsinput input' : function(event, context, doc) {
        $('#taggedUsers').val('');
        var current_tags = Tags.get('taggedUsers') || [];
        var found = _.find(current_tags, function(tag) {
            return tag._id == doc._id;
        });
        if (found == undefined) {
            current_tags.push(doc);
            Tags.set('taggedUsers', current_tags);
        }
    },

    'focus .tagsinput input' : function(event, context) {
        $(event.target).closest('.tagsinput').addClass('focus');
    },

    'blur .tagsinput input' : function(event, context) {
        $(event.target).closest('.tagsinput').removeClass('focus');
    },

    'click .tagclose' : function(event, context) {
        var instance = this;
        var current_tags = Tags.get('taggedUsers');
        current_tags = _.reject(current_tags, function(tag) {
            return tag._id == instance._id;
        });
        Tags.set('taggedUsers', current_tags);
    }
});
