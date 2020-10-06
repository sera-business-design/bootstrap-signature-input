import SignaturePad from 'signature_pad'
import { icon, library } from '@fortawesome/fontawesome-svg-core'
import { faEraser } from '@fortawesome/free-solid-svg-icons'

(function ($) {
  library.add(faEraser)

  $.fn.signature = function (opts) {
    const OUTPUT_DATA = 'data'
    const OUTPUT_PNG = 'png'
    const OUTPUT_JPG = 'jpg'
    const OUTPUT_SVG = 'svg'

    const settings = $.extend({
      outputMode: OUTPUT_DATA, // Re-usable, modifiable
      aspectRatio: 16 / 9,
      throttle: 8
    }, opts)

    return this.each(function () {
      // Always map to hidden input
      const $wrapper = $(this)
      let $origInput = $(this).find('input')
      let $input = $('<input type="hidden">')

      const origSize = {
        width: $wrapper.width(),
        height: $wrapper.height()
      }

      const currentSize = { ...origSize }

      if ($origInput.length === 0) {
        $input
          .attr('name', $(this).data('name'))
          .val($(this).data('url'))
          .prop('disabled', !!$(this).data('disabled'))
      } else {
        $input
          .attr({ name: $origInput[0].name })
          .val($origInput.val())
          .prop('disabled', $origInput.prop('disabled'))

        $origInput.remove()
      }

      $(this).append($input)

      const $canvas = $('<canvas/>')
      $(this).append($canvas)

      // Construct the signature pad
      const pad = new SignaturePad($canvas.get(0), settings)

      pad.onEnd = function () {
        if (!$input.attr('disabled')) {
          switch (settings.outputMode) {
            case OUTPUT_DATA:
              $input.val(JSON.stringify(pad.toData()))
              break
            case OUTPUT_PNG:
              $input.val(pad.toDataURL())
              break
            case OUTPUT_JPG:
              $input.val(pad.toDataURL('image/jpeg'))
              break
            case OUTPUT_SVG:
              $input.val(pad.toDataURL('image/svg+xml'))
              break
          }
        }
      }

      // Resize canvas to fix point mapping to CSS resizing
      window.addEventListener('resize', resize)
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
        const $eraser = $('<div class="__pad__eraser"></div>')
        $eraser.append(icon(faEraser).html)
        $(this).append($eraser)
        $eraser.tooltip({ title: 'Wissen' })

        $eraser.click(function (e) {
          e.preventDefault()
          pad.clear()
          $input.val('')
        })
      } else {
        pad.off()
      }

      function resize () {
        const canvasEl = $canvas.get(0)
        const ctx = canvasEl.getContext('2d')

        // Maintain wrapper aspect ratio
        $wrapper.css({
          height: $wrapper.width() / settings.aspectRatio
        })

        // Get the device pixel ratio (for hi-DPI screens)
        const ratio = Math.max(window.devicePixelRatio || 1, 1)

        // Make a data backup (changing the size clears the canvas)
        const data = pad.toData()

        // Correct the canvas size
        canvasEl.width = canvasEl.offsetWidth * ratio
        canvasEl.height = canvasEl.offsetHeight * ratio

        // Scale the content accordingly
        ctx.scale(ratio, ratio)

        // Redraw canvas and scale the points in the data to new size
        pad.clear()
        pad.fromData(scalePoints(data, $wrapper.width() / currentSize.width))

        // Save current state
        currentSize.width = $wrapper.width()
        currentSize.height = $wrapper.height()
      }

      function scalePoints(data, ratio) {
        if (data.length === 0) {
          return data
        }

        return data.map(stroke => {
          if (typeof stroke.points === 'undefined' || stroke.points.length === 0) {
            return stroke
          }

          stroke.points = stroke.points.map(point => {
            point.x *= ratio
            point.y *= ratio
            return point
          })

          return stroke
        })
      }
    })
  }
}(jQuery))
