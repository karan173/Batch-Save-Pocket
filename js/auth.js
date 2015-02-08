var Auth =  //OOPS through object literals, see http://www.phpied.com/3-ways-to-define-a-javascript-class/
{
	consumer_key : '26599-a591a3cc721d662f7bbbe4e5',
	isAuthenticated : function()
		{
			return localStorage['access_token'] && localStorage['access_token'] !== null;
		},
	authenticate : function()
		{
			var url = 'https://getpocket.com/v3/oauth/request';
			var redirect_uri = window.location.href;
			var data = {
			        "consumer_key" : this.consumer_key,
			        "redirect_uri" : redirect_uri
			    };
			$.ajax
			({
				url : url,
			    data: JSON.stringify(data),
			    headers: 
			    { 
			    	'Content-Type': 'application/json; charset=UTF8', 
			    	'X-Accept' : 'application/json'
				},
			    type: "POST",
			    dataType : "json",
			    success: function( response_json ) 
			    {
			        localStorage['request_token'] = request_token = response_json.code;
			        var redirect_uri = chrome.extension.getURL('html/login.html');
					chrome.tabs.create({'url': 'https://getpocket.com/auth/authorize?request_token='+encodeURIComponent(request_token)+'&redirect_uri='+encodeURIComponent(redirect_uri)}, function(tab) {
					  });   
			    },
			    error: function( xhr, status, errorThrown ) 
			    {
			    	  var error = xhr.getResponseHeader('X-Error');
			    	  if(!error || error === null) //if undefined or null
			    	  {
			    	  		console.log('Unknown error 1 [in authenticate].');
			    	  }
			    	  else
			    	  {
			    	  		console.log(error + '[in authenticate].');
			    	  }
			    },
			 
			    // code to run regardless of success or failure
			    complete: function( xhr, status ) 
			    {
			    }
			});
		},
	getAccessToken : function(callback) //function to get access token for user when request_token is already obtained
		{
			var url = 'https://getpocket.com/v3/oauth/authorize';
			var data = {
			        "consumer_key" : this.consumer_key,
			        "code" : localStorage['request_token']
			    };
			$.ajax
			({
				url : url,
			    data: JSON.stringify(data),
			    headers: 
			    { 
			    	'Content-Type': 'application/json; charset=UTF8', 
			    	'X-Accept' : 'application/json'
				},
			    type: "POST",
			    dataType : "json",
			    success: function( response_json ) 
			    {
			        localStorage['access_token'] = response_json.access_token;
			        localStorage['username'] = response_json.username;
			       	callback();
			    },
			    error: function( xhr, status, errorThrown ) 
			    {
			    	  var error = xhr.getResponseHeader('X-Error');
			    	  if(!error || error === null) //if undefined or null
			    	  {
			    	  		console.log('Unknown error 1 [in getAccessToken].');
			    	  }
			    	  else
			    	  {
			    	  		console.log(error + '[in getAccessToken].');
			    	  }
			    },
			 
			    // code to run regardless of success or failure
			    complete: function( xhr, status ) 
			    {
			    }
			});
		}
};