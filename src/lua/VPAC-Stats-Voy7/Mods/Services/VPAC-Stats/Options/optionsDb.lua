local DbOption = require('Options.DbOption')

return
{
	statsEnabled = DbOption.new():setValue(true):checkbox(),
	statsServer = DbOption.new():setValue(false):checkbox(),
	statsKey = DbOption.new():setValue("1234"):editbox(),
}