Template.side_menu.helpers({
  'villages': () => {
    let villages = Villages.find({ 'friendlySlugs.slug.base': { $ne: 'main' } }).fetch();


    // Logic for filtering villages
    let activeVillage = appBodyRef.activeVillage.get();
    let dateLimit = new Date() - 7; // 7 days ago

    villages.forEach((village) => {
      // Check if village is active
      if(activeVillage) {
        village['active'] = (village.friendlySlugs.slug.base === activeVillage.friendlySlugs.slug.base) ? true : false;
      }

      // Count numbers of new songs in past week
      village['newSongs'] = village.posts.reduce((previous, current ) => {
        if(Date.parse(current.createdAt) < dateLimit) {
          return previous + 1;
        }
        return previous;
      }, 0);
    });

    // Filter villages to show only those which contains more than 5 new songs for previous 7 days
    villages = villages.filter((village) => {
      return village.newSongs >= 5 ? true : false;
    });

    // Sort villages by the number of new songs (Descending)
    villages.sort((village_1, village_2) => {
      return village_1.newSongs < village_2.newSongs ? 1 : -1;
    });

    return villages;
  }
})
