function deleteSatellite(id){
    $.ajax({
        url: '/satellites/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
