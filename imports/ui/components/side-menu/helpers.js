Template.side_menu.helpers({
  'villages': () => {
    let villages = Villages.find({ 'friendlySlugs.slug.base': { $ne: 'main' } }).fetch();


    let activeVillage = appBodyRef.activeVillage.get();
    let visitedVillages = sideMenuRef.visitedVillages.get();

    // Add activeVillage to the list of visitedVillages
    // TO DO: Implement a proper system for village notifications
    if(activeVillage && visitedVillages[activeVillage._id] !== true) {
      visitedVillages[activeVillage._id] = true;
      sideMenuRef.visitedVillages.set(visitedVillages);
    }

    // Logic for filtering villages
    let dateLimit = new Date() - 7; // 7 days ago
    let newSongsLimit = 5; // minimum 5 new songs
    let villagesToShow = ['soulection', 'okayplayer', 'eclecticasfuck', 'indieheads', 'freshasfuck'];

    // Show only villages stated in villagesToShow (respectively)
    let totalNumberOfVillages = villages.length;
    villagesToShow.forEach((village) => {
      for(let i = 0; i < totalNumberOfVillages; i++) {
        if(villages[i].friendlySlugs.slug.base === village) {
          villages.push(villages[i]);
        }
      }
    })
    villages.splice(0, villages.length - villagesToShow.length);


    villages.forEach((village) => {
      // Check if village is active
      if(activeVillage) {
        village['active'] = (village.friendlySlugs.slug.base === activeVillage.friendlySlugs.slug.base) ? true : false;
      }

      // Count numbers of new songs in past week
      village['newSongs'] = 0;
      village.posts.forEach( (post) => {
        if(Date.parse(post.createdAt) < dateLimit) {
          village['newSongs']++;
        }
      });

      // Show number of new songs for village (notification),
      // or hide if village is already visited in this session
      village['showNotification'] = (visitedVillages[village._id] || village['newSongs'] === 0) ? false : true;

    });

    // Filter villages to show only those which contains more than 5 new songs for previous 7 days
    // villages = villages.filter((village) => {
    //   return village.newSongs >= newSongsLimit ? true : false;
    // });

    // Sort villages by the number of new songs (Descending)
    // villages.sort((village_1, village_2) => {
    //   return village_1.newSongs < village_2.newSongs ? 1 : -1;
    // });




    return villages;
  }
})
