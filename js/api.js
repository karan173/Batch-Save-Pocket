var PocketAPI = 
{
	
	modify : function(actions)
	{
		var url = 'https://getpocket.com/v3/send?consumer_key='+encodeURIComponent(Auth.consumer_key);
		//console.log(url);
		var data = 
		{
			"consumer_key": Auth.consumer_key,
		    "access_token": localStorage['access_token'],
		    "actions": actions
		};
		$.ajax
		({
			url : url,
			type: "POST",
			dataType : "json",
			data : JSON.stringify(data),
			beforeSend: function()
				{
					$('#link-content').hide();
					$('#no-link-content').hide();
					$('#loading').show();
				},
			headers :
			    { 
			    	'Content-Type': 'application/json; charset=UTF8', 
			    	'X-Accept' : 'application/json'
				},
			success: function( response_json ) 
				{
					$('#loading').hide();
					$('#success').show();
				},
			error: function( xhr, status, errorThrown ) 
			    {
			    	  var error = xhr.getResponseHeader('X-Error');
			    	  // console.log(status);
			    	  // console.log(errorThrown);
			    	  var error_status = xhr.status;
			    	  if(error_status >= 400 && error_status<500)
			    	  {
			    	  		//authentication issue
			    	  		Auth.authenticate();
			    	  }
			    	  if(!error || error === null) //if undefined or null
			    	  {
			    	  		console.log('Unknown error 1 [in PocketAPI.modify].');
			    	  		error = "Error. The Request could not be completed. Contact extension developer if error persists.";
			    	  }
			    	  else
			    	  {
			    	  		error = 'Error: ' + error;  
			    	  }
			    	 $('#loading').hide();
			    	 $('#error').text(error);
					 $('#error').show();
			    },
			complete: function( xhr, status ) 
			    {
			    } 
		});
	}
};