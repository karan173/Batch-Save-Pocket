(function()
{
	var linksSelected = false;
	function buildPage()
	{
		chrome.tabs.executeScript(null, {file:"js/script.js"});
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) 
			{
				urls = request.urls;
				titles = request.titles;
				$('#no-link-content').hide();
				$('#link-content').show();
				var checkbox = '<input type="checkbox" checked>';
				var tag_input = '<input type = "text" style = "max-width:150px">';
				for (var i=0; i<urls.length; i++) 
				{
					var url = urls[i];
					str = "<tr><td>" + (i+1) + "</td>" + "<td>" + checkbox +"</td>" +"<td>"+titles[i]+"</td>" + "<td><a href = '" + url + "' target='_blank' >"  + url + "</a></td><td>" + tag_input + "</td></tr>";
					$('#mytable > tbody').append(str);
				}
			});
	}
	function single_submit_handler()
	{
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs)
		{
			var current_url = tabs[0].url;
			var tags = $('#single-tag').val();
			actions = [];
			row = 
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
		common_tags = $('#common-tags').val();
		actions = [];
		$('input:checkbox:checked').each(function()
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
					row = 
					{
						"tags" : tags,
						"title" : title,
						"url" : link,
						"action" : "add",
					};
					actions.push(row);
				});
		PocketAPI.modify(actions, function()
		{
			alert('done');
		}, function()
		{
			alert('error');
		});
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
		buildPage();
		if(!linksSelected)
		{
			$('#link-content').hide();
			$('#no-link-content').show();
		}
	});
})();
