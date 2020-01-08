const fs = require('fs')
const PDFDocument = require('pdfkit')
const ipp = require('ipp')

const PATH = './images'
const PRINTER = 'http://localhost:631/printers/Star_TSP143__STR_T_001_'
const PAGE_SIZE = [mm(80), mm(80)]
const PAPER_SIZE = 'Custom.80x80mm'

let files = []

fs.readdir(PATH, (err, f) => {
	if (err) {
		console.log(err)
		process.exit()
	}

	files = f.filter(file => file != '.DS_Store')

	console.log(`${files.length} images loaded.`)
	printNext()
	setInterval(printNext, 5500)
})

function printNext() {
	const file = PATH + '/' + files[Math.floor(Math.random() * files.length)]
	console.log(`Randomly selected: ${file}`)
	printImage(file)
}

function printImage(f) {
	const doc = new PDFDocument({autoFirstPage: false})
	let buffer = []
	doc.on('data', buffer.push.bind(buffer))

	var page = doc.addPage({
		size: PAGE_SIZE,
		layout: 'landscape',
		margin: 0
	})

	page.image(f, mm(25), mm(10), {
		fit: [mm(30), mm(30)],
		align: 'center',
		valign: 'center'
	})

	doc.on('end', function() {
		var file = {
			'job-attributes-tag': {
				'media': PAPER_SIZE
			},
			'operation-attributes-tag': {
				'requesting-user-name': 'random',
				'job-name': f,
				'requesting-user-name': 'random',
				'document-format': 'application/pdf',
			},
			data: Buffer.concat(buffer)
		}

		var printer = ipp.Printer(PRINTER)
		printer.execute("Print-Job", file, function (err, res) {
			delete buffer
		})
	})

	doc.end()
}

function mm(mm) {
	return mm * 2.834645669291
}
