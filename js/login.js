$(document).ready(function()
{
	Auth.getAccessToken(function()
	{
		$('#login_text').text('Congratulations ' + localStorage['username'] + '. You can now use the Batch Save Extension :). This extension is developed by karan173[ksb.nsit@gmail.com]');	
	});
});