//extract url and name of all branches associated with the given root.
//Remove charactersToRemove in the name of the branch name if given and exists.
export async function createJenkinslistFromRoot(root, charactersToRemove){
    let jenkinsList = await fetch("/jenkinslist")
        .then(response => response.json())
        .catch(err => {
            console.log("Unable to retrieve jenkins data from backend ", err);
          });
    
    //extract root matched project jenkins data
    let targetJenkinsList = Object.values(jenkinsList).filter((item, index) => {
        return item.name === root
    })
    targetJenkinsList = targetJenkinsList ? targetJenkinsList[0].branch : [];

    //remove given charactersToRemove from the name if exists.
    let finalTargetJenkinsList = targetJenkinsList;
    if (charactersToRemove && targetJenkinsList.length != 0) {
        finalTargetJenkinsList = targetJenkinsList.map((item, index) => 
            {return ({NAME:item.name.replace(charactersToRemove,""), URL:item.url+"/master/"})})
    }
    return finalTargetJenkinsList;
}