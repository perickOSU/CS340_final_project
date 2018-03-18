function deleteContractorCountry(bid, cid){
    $.ajax({
        url: '/contractorscountries/' + bid + "/" + cid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
