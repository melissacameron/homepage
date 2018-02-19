$(function() {
  // Settings
  var width = 12;
  var height = 10;
  var space = 3;

  var timeBetweenPods = 300;
  var timeBetweenTriangles = 40;

  // The code
  var interval;

  $(window).resize(function() {
    if (interval) {
      $('#triangles').remove();
      clearInterval(interval);
    }

    var podsX = Math.ceil($(window).width() / ((width / 2) + space));
    var podsY = Math.ceil($(window).height() / (height + space));

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'triangles');
    svg.setAttribute('id', 'triangles');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    $('body').append(svg);

    function makeTriangle(left, top) {
      var leftPx = left * ((width / 2) + space);
      var topPx = top * (height + space);

      var attrs;
      if (xor(left % 2, top % 2)) {
        attrs = { points:`${(width / 2) + leftPx},${topPx} ${width + leftPx},${height + topPx} ${leftPx},${height + topPx}` };
        attrs['class'] = 'down';
      } else {
        attrs = { points:`${(width / 2) + leftPx},${topPx + height} ${width + leftPx},${topPx} ${leftPx},${topPx}` };
        attrs['class'] = 'up';
      }

      attrs['stroke-linejoin'] = "round";
      attrs['class'] += ' on o' + Math.ceil(Math.random() * 5);
      attrs['data-x'] = left;
      attrs['data-y'] = top;
      attrs['class'] += ' triangle-' + left + '-' + top;

      var el= document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      for (var k in attrs) {
        el.setAttribute(k, attrs[k]);
      }
      svg.appendChild(el);
    }

    function xor(a,b) {
      return ( a || b ) && !( a && b );
    }

    var hide = Math.floor(podsX * 0.7);
    for (var y = 0; y < podsY; y++) {
      hide--;
      for (var x = 0; x < podsX; x++) {
        if (x >= hide) {
          makeTriangle(x, y);
        }
      }
    }

    $('#triangles').addSVGClass('ready');

    var $triangles = $('#triangles polygon.up');
    interval = setInterval(function() {
      var els = [];
      var x = $triangles.random().data('x');
      var y = $triangles.random().data('y');

      for(var i = 0; i < 5; i++) {
        els.push('triangle-' + x + '-' + y);
        x++;
        els.push('triangle-' + x + '-' + y);
        y--;
      }

      $(els).each(function(i, css) {
        setTimeout(function() {
          $('.' + css).removeSVGClass('on');
        }, timeBetweenTriangles * i);
        setTimeout(function() {
          $('.' + css).addSVGClass('on');
        }, (timeBetweenTriangles * (els.length + 1)) + (timeBetweenTriangles * i));
      });

    }, timeBetweenPods);
  }).trigger('resize');
});

$.fn.addSVGClass = function(className) {
  $(this).each(function() {
    $(this)[0].setAttribute('class', $(this)[0].getAttribute('class') + ' ' + className);
  });
};

$.fn.removeSVGClass = function(className) {
  $(this).each(function() {
    $(this)[0].setAttribute('class', $(this)[0].getAttribute('class').replace(className, ''));
  });
};

$.fn.random = function() {
  return $(this).eq(Math.floor(Math.random() * $(this).length));
};
