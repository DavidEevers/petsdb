(function($) {
  let obj;

  function showSelection() {
    obj.map(e => {
      $('#result').append(
        '<tr><td>' +
          e.name +
          '</td><td>' +
          e.species +
          '</td><td>' +
          e.sex +
          '</td><td>' +
          e.age +
          '</td><td>' +
          e.remark +
          '</td><td>' +
          e.datum +
          '</td><td>' +
          '<button class="delete" data-petid="' +
          e.id +
          '">Remove</button>' +
          '</td><td>' +
          '<button class="change">change</button>' +
          '</td></tr>'
      );
    });
  }

  function petCall() {
    $.ajax({
      url: 'http://localhost:3000/',
      type: 'POST',
      dataType: 'text'
    })
      .done(function(response) {
        console.log(response);
        obj = JSON.parse(response);
        console.log(obj);
        showSelection();
      })
      .fail(function(xhr, status, errorThrown) {
        alert('Sorry, there was a problem!');
        console.log('Error: ' + errorThrown);
        console.log('Status: ' + status);
        console.dir(xhr);
      })
      .always(function(xhr, status) {
        console.log('The request is complete!');
      });
  }

  function deleteRec(id) {
    $.ajax({
      url: 'http://localhost:3000/' + id,
      type: 'DELETE'
      //dataType: 'text',
    })
      .done(function(response) {
        console.log(response);
        /* obj = JSON.parse(response);
        console.log(obj);
        showSelection(); */
      })
      .fail(function(xhr, status, errorThrown) {
        alert('Sorry, there was a problem!');
        console.log('Error: ' + errorThrown);
        console.log('Status: ' + status);
        console.dir(xhr);
      })
      .always(function(xhr, status) {
        console.log('The request is complete!');
      });
  }

  /* on load */

  $(document).ready(function() {
    petCall();
    $(document).on('click', '.delete', function() {
      const id = $(this).data('petid');
      console.log(id);
      deleteRec(id);
    });
  });
})(jQuery);
