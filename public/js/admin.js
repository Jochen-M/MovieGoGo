$(function(){
	$('.del').click(function(e){
		let target = $(e.target);
		let id = target.data('id');
		let tr = $('.item-id-' + id);

		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/delete?id=' + id
		}).done(function(results){
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove();
				}
			}
		});
	});

	$('#douban').blur(function(){
		let id = $(this).val();
		$.ajax({
			url: 'https://api.douban.com/v2/movie/subject/' + id,
			cache: true,
			type: 'get',
			dataType: 'jsonp',
			crossDomain: true,
			jspnp: 'callback',
			success: function(data){
				$('#inputTitle').val(data.title);
				$('#inputDirector').val(data.directors[0].name);
				$('#inputCountry').val(data.countries[0]);
				$('#inputPoster').val(data.images.large);
				$('#inputShowAt').val(data.year);
				$('#inputSummary').val(data.summary);
			}
		})
	});
});
