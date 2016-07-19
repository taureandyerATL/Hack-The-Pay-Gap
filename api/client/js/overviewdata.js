

function overviewChange() {
    //alert(document.getElementById("exampleRecipientInput").value);
    var selectedVal = document.getElementById("exampleRecipientInput").value;
    if(selectedVal == 'Option 2')
    {
        document.getElementById("divPrjDemographics").style.display = 'block';
        document.getElementById("divTtlDemographics").style.display = 'block';
        document.getElementById("divWageAnalysis").style.display = 'none';
    }
    else if(selectedVal == 'Option 3')
    {
        document.getElementById("divPrjDemographics").style.display = 'none';
        document.getElementById("divTtlDemographics").style.display = 'none';
        document.getElementById("divWageAnalysis").style.display = 'block';
    }
    else 
    {
        document.getElementById("divPrjDemographics").style.display = 'block';
        document.getElementById("divTtlDemographics").style.display = 'block';
        document.getElementById("divWageAnalysis").style.display = 'block';
    }
           
}
