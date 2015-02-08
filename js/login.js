$(document).ready(function()
{
	Auth.getAccessToken(function()
	{
		$('#login_text').html('<h3>Congratulations ' + localStorage['username'] + 
		'. You can now use the Batch Save Extension :). This extension is developed by karan173[ksb.nsit@gmail.com].'+
		'<br>Please review the extension on <a href = '+
		'"https://chrome.google.com/webstore/detail/batch-save-pocket/ihhiomekhplpdojbcaniaglcfopckaef">'+
		'Chrome web store</a> if you like it</h3>');	
	});
});