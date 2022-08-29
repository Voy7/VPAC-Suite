local DbOption = require('Options.DbOption')

return
{
	statsEnabled = DbOption.new():setValue(true):checkbox(),
	statsServer = DbOption.new():setValue(false):checkbox(),
	statsKey = DbOption.new():setValue("018138"):editbox(),
}