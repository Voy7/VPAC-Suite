// Crop image to specificed aspect ratio and lower quality
// to given resolution, cropped image will be from center.
export default function cropImage(file, resolution, ratio) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onerror = error => reject(error)
    reader.onload = () => {
      canvasTransformImage(reader.result, resolution, ratio).then(image => {
        resolve(image)
      })
    }
  })
}

// Use the Canvas element to transform image.
function canvasTransformImage(url, resolution, aspectRatio) {
  return new Promise(resolve => {
      const inputImage = new Image()
      inputImage.onload = () => {
          const inputImageAspectRatio = inputImage.naturalWidth / inputImage.naturalHeight
          const inputWidth = resolution * inputImageAspectRatio
          const inputHeight = resolution
          let outputWidth = inputWidth
          let outputHeight = inputHeight
          if (inputImageAspectRatio > aspectRatio) {
              outputWidth = inputHeight * aspectRatio
          } else if (inputImageAspectRatio < aspectRatio) {
              outputHeight = inputWidth / aspectRatio
          }
          const outputX = (outputWidth - inputWidth) * 0.5
          const outputY = (outputHeight - inputHeight) * 0.5
          const outputImage = document.createElement('canvas')
          outputImage.width = outputWidth
          outputImage.height = outputHeight
          const ctx = outputImage.getContext('2d')
          ctx.drawImage(inputImage, outputX, outputY, inputWidth, inputHeight)
          resolve(outputImage.toDataURL())
      }
      inputImage.src = url
  })
}