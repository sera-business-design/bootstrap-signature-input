import SignaturePad from 'signature_pad'

(function ($) {
  $.fn.signature = function (opts) {
    const settings = $.extend({
      throttle: 8
    }, opts)

    return this.each(function () {
      // Always map to hidden input
      let $origInput = $(this).find('input')
      let $input = $('<input type="hidden">')

      if ($origInput.length === 0) {
        $input
          .attr('name', $(this).data('name'))
          .val($(this).data('url'))
          .prop('disabled', !!$(this).data('disabled'))
      } else {
        $input
          .attr({name: $origInput[0].name})
          .val($origInput.val())
          .prop('disabled', $origInput.prop('disabled'))

        $origInput.remove()
      }

      $(this).append($input)

      const $canvas = $('<canvas/>')
      $(this).append($canvas)

      // Construct the signature pad
      const pad = new SignaturePad($canvas.get(0), settings)

      // Resize canvas to fix point mapping to CSS resizing
      window.addEventListener("resize", resize);
      resize()

      // Try to set data
      if ($input.val()) {
        try {
          // This will fail when base64 data was provided
          pad.fromData(JSON.parse($input.val()))
        } catch (e) {
          pad.fromDataURL($input.val())
        }
      }

      // If pad is editable, append an eraser icon
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

      // Catch form submit event, put new data in input field, then resubmit
      $(this).closest('form').submit(function (e) {
        e.preventDefault()
        if (!$input.attr('disabled')) {
          $input.val(JSON.stringify(pad.toData()))
        }
        $(this).unbind('submit').submit()
      })

      function resize () {
        const ratio = Math.max(window.devicePixelRatio || 1, 1)

        const data = pad.toData()

        const canvasEl = $canvas.get(0)
        canvasEl.width = canvasEl.offsetWidth * ratio
        canvasEl.height = canvasEl.offsetHeight * ratio
        canvasEl.getContext('2d').scale(ratio, ratio)

        pad.clear()
        pad.fromData(data)
      }
    })
  }
}(jQuery))