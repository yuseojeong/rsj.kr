import AppKit
import PDFKit

// Preserve the original slide order and dimensions without cropping.
let args = Array(CommandLine.arguments.dropFirst())
guard args.count >= 2 else {
    fatalError("Usage: swift assemble-image-pdf.swift output.pdf slide1.png [slide2.png ...]")
}
let document = PDFDocument()
for (index, filename) in args.dropFirst().enumerated() {
    guard let image = NSImage(contentsOfFile: filename),
          let page = PDFPage(image: image) else {
        fatalError("Cannot read slide: \(filename)")
    }
    document.insert(page, at: index)
}
guard document.write(toFile: args[0]) else { fatalError("Cannot write PDF") }
print("Created \(document.pageCount)-page PDF: \(args[0])")
