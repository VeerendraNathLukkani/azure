function createProjectAndRepo(){

    document.getElementById('loader').style.display = 'block';
	var project_name = document.getElementById("project_name").value;
	var project_description = document.getElementById("project_description").value;
	var v_control = document.getElementById("version_control");
	var version_control = v_control.options[v_control.selectedIndex].text;
	var visibility_1 = document.getElementById("visibility");
	var visibility = visibility_1.options[visibility_1.selectedIndex].text;
	var p_template = document.getElementById("process_template");
	var process_template = p_template.options[p_template.selectedIndex].value;
	var o_name = document.getElementById("organization_name");
	var organization_name = o_name.options[o_name.selectedIndex].id;
//	REPOSITORY PART
	var repository_name_repo = document.getElementById("repository_name_repo").value;
	var repository_name_repo1 = document.getElementById("repository_name_repo1").value;
	var p_name_repo = document.getElementById("project_name_repo");
	var project_name_repo = p_name_repo.options[p_name_repo.selectedIndex].id;

    console.log(organization_name)

    var xhr = new XMLHttpRequest();
var url = "http://"+host_name+":5000/projectandrepo";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    document.getElementById('loader').style.display = 'none';

    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
//        window.alert(json)
        if(json.hasOwnProperty('typeKey')){
        window.alert( json['message'])
        }
        else{
window.alert('Successful Created' )



//         for (var key in json) {
//    // check if the property/key is defined in the object itself, not in parent
//    if (json.hasOwnProperty(key)) {
//        console.log(key, json[key]);
//        window.alert( json[key])
//    }
//        if(json.status == "success"){
//
//        console.log(json.status);
//        }
    }

    }
};
var data = JSON.stringify({'project_data':{"name": project_name, "description": project_description,
 "visibility":visibility, "capabilities": { "processTemplate": {
      "templateTypeId":process_template}, "versioncontrol": {
      "sourceControlType": version_control}}}, "organization":organization_name,
      'repo_list':[repository_name_repo, repository_name_repo1] });
xhr.send(data);



	}

