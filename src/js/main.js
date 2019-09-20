import SignaturePad from 'signature_pad'

(function ($) {
  function resize ($canvas) {
    const ratio = Math.max(window.devicePixelRatio || 1, 1)

    const canvasEl = $canvas.get(0)
    canvasEl.width = canvasEl.offsetWidth * ratio
    canvasEl.height = canvasEl.offsetHeight * ratio
    canvasEl.getContext('2d').scale(ratio, ratio)
  }

  $.fn.signature = function (opts) {
    const settings = $.extend({
      throttle: 8
    }, opts)

    return this.each(function () {
      const $canvas = $('<canvas/>')
      $(this).append($canvas)

      let $input = $(this).find('input')
      if ($input.length === 0) {
        $input = $('<input type="hidden">')
          .attr('name', $(this).data('name'))
          .val($(this).data('url'))
        $(this).append($input)
      }

      window.addEventListener("resize", () => resize($canvas));
      resize($canvas)

      const pad = new SignaturePad($canvas.get(0), settings)

      if ($input.val()) {
        try {
          pad.fromData(JSON.parse($input.val()))
        } catch (e) {
          pad.fromDataURL($input.val())
        }
      }

      /*
       * If pad is editable, append an eraser icon
       */
      if (!$input.attr('disabled')) {
        const $eraser = $('<div class="__pad__eraser"><i class="fas fa-lg fa-fw fa-eraser"></i></div>')
        $(this).append($eraser)
        $eraser.tooltip({ title: 'Wissen' })

        $eraser.click(function (e) {
          e.preventDefault()
          pad.clear()
        })
      } else {
        pad.off()
      }

      $(this).closest('form').submit(function (e) {
        e.preventDefault()
        if (!$input.attr('disabled')) {
          $input.val(JSON.stringify(pad.toData()))
        }
        $(this).unbind('submit').submit()
      })
    })
  }
}(jQuery))