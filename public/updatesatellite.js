function updateSatellite(id){
    $.ajax({
        url: '/satellites/' + id,
        type: 'PUT',
        data: $('#update-satellite').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
