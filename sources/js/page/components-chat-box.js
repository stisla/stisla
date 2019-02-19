"use strict";

var chats = [
  {
    text: 'Hi, dude!',
    position: 'left'
  },
  {
    text: 'Wat?',
    position: 'right'
  },
  {
    text: 'You wanna know?',
    position: 'left'
  },
  {
    text: 'Wat?!',
    position: 'right'
  },
  {
    typing: true,
    position: 'left'
  }
];
for(var i = 0; i < chats.length; i++) {
  var type = 'text';
  if(chats[i].typing != undefined) type = 'typing';
  $.chatCtrl('#mychatbox', {
    text: (chats[i].text != undefined ? chats[i].text : ''),
    picture: (chats[i].position == 'left' ? 'assets/img/avatar/avatar-1.png' : 'assets/img/avatar/avatar-2.png'),
    position: 'chat-'+chats[i].position,
    type: type
  });
}

$("#chat-form").submit(function() {
  var me = $(this);

  if(me.find('input').val().trim().length > 0) {
    $.chatCtrl('#mychatbox', {
      text: me.find('input').val(),
      picture: 'assets/img/avatar/avatar-2.png',
    });
    me.find('input').val('');
  }
  return false;
});

var chats = [
  {
    text: 'Wake up!',
    position: 'left'
  },
  {
    text: 'Yes, already',
    position: 'right'
  },
  {
    text: 'Grab a brush and put a little make-up',
    position: 'left'
  },
  {
    text: 'What do you mean?',
    position: 'right'
  },
  {
    text: 'Hide the scars to fade away the shake-up',
    position: 'left'
  },
  {
    text: 'WTF?!',
    position: 'right'
  },
  {
    text: 'Why\'d you leave the keys upon the table?',
    position: 'left'
  },
  {
    text: '-__________________-',
    position: 'right'
  },
  {
    text: 'Here you go create another fable',
    position: 'left'
  },
  {
    text: 'You wanted do!',
    position: 'right'
  },
  {
    text: 'FXCK!',
    position: 'right'
  },
  {
    text: '<i>You have blocked Ryan</i>',
    position: 'right'
  },
];
for(var i = 0; i < chats.length; i++) {
  var type = 'text';
  if(chats[i].typing != undefined) type = 'typing';
  $.chatCtrl('#mychatbox2', {
    text: (chats[i].text != undefined ? chats[i].text : ''),
    picture: (chats[i].position == 'left' ? 'assets/img/avatar/avatar-5.png' : 'assets/img/avatar/avatar-2.png'),
    position: 'chat-'+chats[i].position,
    type: type
  });
}
$("#chat-form2").submit(function() {
  var me = $(this);

  if(me.find('input').val().trim().length > 0) {
    $.chatCtrl('#mychatbox2', {
      text: me.find('input').val(),
      picture: 'assets/img/avatar/avatar-2.png',
    });
    me.find('input').val('');
  }
  return false;
});
