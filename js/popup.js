(function()
{
	function buildLinks(links)
	{
		var urls = links.urls;
		var titles = links.titles;
		$('#no-link-content').hide();
		$('#link-content').show();
		var checkbox = '<input type="checkbox" checked>';
		var tag_input = '<input type = "text" style = "max-width:150px">';
		for (var i=0; i<urls.length; i++) 
		{
			var url = urls[i];
			var title_input = '<input type = "text" style = "max-width:150px" value = "'+ titles[i] +'">';
			var str = "<tr><td>" + (i+1) + "</td>" + "<td>" + checkbox +"</td>" +"<td>"+title_input+"</td>" +
				"<td><a href = '" + url + "' target='_blank' >"  + url + "</a></td><td>" + tag_input + "</td></tr>";
			$('#mytable > tbody').append(str);
		}
		$('.toggable').hide();
		$('#link-content').show();
	}
	function single_submit_handler()
	{
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs)
		{
			var current_url = tabs[0].url;
			var tags = $('#single-tag').val();
			var actions = [];
			var row = 
			{
				"tags" : tags,
				"url" : current_url,
				"action" : "add",
			};
			actions.push(row);
			PocketAPI.modify(actions);
		});
	}
	function pocket_button_handler()
	{
		chrome.tabs.create({'url': 'http://getpocket.com/a/queue/list/'});  
	}
	function submit_button_handler()
	{
		var common_tags = $('#common-tags').val();
		var actions = [];
		var unix_timestamp = Math.round((new Date()).getTime() / 1000); 
		$('input:checkbox:checked').each(function(index)
		{
			var title = $(this).parent().next();
			var link = title.next();
			var tags = link.next()[0].children[0].value; //somehow can't get jquery to work here, so had to use pure js
			//var tags = link.nextSibling;
			title = title.text();
			link = link.text();
			if(common_tags.length > 0)
			{
				tags = tags + ',' + common_tags;
			}
			var row = 
			{
				"tags" : tags,
				"title" : title,
				"url" : link,
				"action" : "add",
				"time" : '' + (unix_timestamp-index) 
				//those above in last will have max time and therefore will appear up in Pocket interfaces
			};
			actions.push(row);
		});
		PocketAPI.modify(actions);
	}
	
	//taken from http://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
	//the RegexBuddy answer
	var regex =  /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/gi;
	function parse_submit_handler()
	{
		var text = $('#links').val();
		var urls = text.match(regex);
		if(!urls || urls.length === 0)
		{
			$('#paste-error').text('Please enter a valid list').show();
			return;
		}
		var titles = [];
		for(var i = 0; i < urls.length; i++)
		{
			titles.push('');
		}
		var req = {"urls" : urls, "titles" : titles};
		buildLinks(req);
	}	
	function logout_hander()
	{
		Auth.logout();
	}
	$(document).ready(function()
	{
		if(!Auth.isAuthenticated())
		{
			Auth.authenticate();	
		} 	
		$('.pocket-button').click(pocket_button_handler); //common to both
		$('#submit-single-button').click(single_submit_handler);
		$('#submit-button').click(submit_button_handler);
		$('#parse-links').click(parse_submit_handler);
		$('a#logout').click(logout_hander);
		$('body').on('click', 'a.link', function(){  //set up hyperlinks in popup.html as chrome blocks them
    		chrome.tabs.create({url: $(this).attr('href')});
    		return false;
	   	});
		chrome.tabs.executeScript(null, {file:"js/script.js"});
		
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) 
			{
				buildLinks(request);
			});
	});
})();
