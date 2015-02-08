// http://groups.google.com/group/mozilla.dev.tech.dom/browse_thread/thread/7ecbbb066ff2027f
// Martin Honnen
//  http://JavaScript.FAQTs.com/ 
(function()
{
	function getLinks(rawHTML)
	{
		var doc = document.createElement("html");
		doc.innerHTML = rawHTML;
		var links = doc.getElementsByTagName("a");
		var titles = [];
		var urls = [];
		for (var i=0; i<links.length; i++) 
		{
			if(links[i].href.length===0)
			{
				continue;
			}
			urls.push(links[i].href);
			titles.push(links[i].innerText);
		}
		return {"urls" : urls, "titles":titles};
	}
	(function sendLinksMessage()
	{
		var selection = window.getSelection();
		if(selection && selection.rangeCount > 0)
		{
			var range = selection.getRangeAt(0);
			if (range) 
			{
				var div = document.createElement('div');
				div.appendChild(range.cloneContents());
				var vs=div.innerHTML;
				var req = getLinks(vs);
				//console.log(req);
				if(req.urls.length > 0)
				{
					chrome.runtime.sendMessage(req);
				}
			}
		}
	})();
})();
