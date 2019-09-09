//extract url and name of all branches associated with the given root.
//Remove charactersToRemove in the name of the branch name if given and exists.
//@param:
//  root: (string) to be used for finding the name of root url in /jenkinslist
//  branchToRemove: (string) remove matching branch in the name key.
//  charactersToRemove: (string) remove matching string from the value in the name key.
export async function createJenkinslistFromRoot(
  root,
  branchToRemove,
  charactersToRemove
) {
  let jenkinsList = await fetch("/jenkinslist")
    .then(response => response.json())
    .catch(err => {
      console.log("Unable to retrieve jenkins data from backend ", err);
    });

  //extract root matched project jenkins data
  let targetJenkinsList = Object.values(jenkinsList).filter((item, index) => {
    return item.name === root;
  });
  targetJenkinsList = targetJenkinsList ? targetJenkinsList[0].branch : [];

  //remove branch of matching branchToRemove and given charactersToRemove from the name if exists.
  let finalTargetJenkinsList = targetJenkinsList;
  if (charactersToRemove && targetJenkinsList.length != 0) {
    finalTargetJenkinsList = targetJenkinsList
      .filter(item => !item.name.includes(branchToRemove))
      .map((item, index) => {
        let url =
          item.branch &&
          item.branch.filter(item => item.name.includes("master")).length
            ? item.url + "master/"
            : item.branch[0].url;
        return { NAME: item.name.replace(charactersToRemove, ""), URL: url };
      });
  }
  return finalTargetJenkinsList;
}
