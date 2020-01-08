var ipp = require('ipp');
var id = 0x0123;//made up reqid

var printer = ipp.Printer("http://localhost:631/printers/_10_96_128_12");
printer.execute("Get-Printer-Attributes", null, function(err, res){
	console.log(res);
});
