var smithingItems = [];
var smithingSorted = [];
var currentSmith = null;
var isSmithing = false;
var smithingTimeout = null;
var smithReqCheck = [];
var selectedSmith = null;
var smithInterval = 2000;
function startSmithing(clicked=false) {
    if (!idleChecker(CONSTANTS.skill.Smithing)) {
        if (selectedSmith !== null) {
            if (clicked && isSmithing && currentSmith === selectedSmith) {
                clearTimeout(smithingTimeout);
                isSmithing = false;
                currentSmith = null;
                $("#skill-nav-name-5").removeClass("text-success");
                resetProgressAnimation("smithing-progress");
                clearOffline();
            } else if (skillLevel[CONSTANTS.skill.Smithing] >= items[smithingItems[selectedSmith].itemID].smithingLevel) {
                let item = smithingItems[selectedSmith].itemID;
                let smithCheck = checkSmithingReq(item);
                if (!smithCheck) {
                    notifyPlayer(CONSTANTS.skill.Smithing, "You don't have the required materials to Smith that.", "danger");
                    clearOffline();
                } else {
                    if (SETTINGS.general.pushNotificationOffline && (offline.skill === null || scheduledPushNotifications["offlineSkill"] === ""))
                        sendPushNotification(`offlineSkill`, `You have been away for roughly 12 hours! Time cap reached. (${username})`, 43200000);
                    offline.skill = CONSTANTS.skill.Smithing;
                    offline.action = selectedSmith;
                    offline.timestamp = new Date().getTime();
                    saveData("offline");
                    isSmithing = true;
                    currentSmith = selectedSmith;
                    smithInterval = 2000;
                    smithInterval = calculateSkillInterval(CONSTANTS.skill.Smithing, smithInterval, smithingItems[selectedSmith].smithingID);
                    $("#skill-nav-name-5").addClass("text-success");
                    animateProgress("smithing-progress", smithInterval);
                    smithingTimeout = setTimeout(function() {
                        let smithCheck = checkSmithingReq(item);
                        if (!smithCheck) {
                            notifyPlayer(CONSTANTS.skill.Smithing, "You don't have the required materials to Smith that.", "danger");
                            clearOffline();
                        } else {
                            let qtyToAdd = 1;
                            if (items[smithingItems[selectedSmith].itemID].smithingQty != undefined)
                                qtyToAdd = items[smithingItems[selectedSmith].itemID].smithingQty;
                            if (checkSummoningSynergyActive(3, 17, true, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, smithInterval, smithingItems[selectedSmith].smithingID)) && rollPercentage(playerModifiers.summoningSynergy_3_17))
                                qtyToAdd++;
                            let chanceToDouble = 0;
                            chanceToDouble += calculateChanceToDouble(CONSTANTS.skill.Smithing, false, 0, selectedSmith, smithingItems[selectedSmith].itemID, true, smithInterval);
                            if (rollPercentage(chanceToDouble))
                                qtyToAdd *= 2;
                            if (herbloreBonuses[11].bonus[0] === 0 && herbloreBonuses[11].charges > 0 && (smithingItems[selectedSmith].itemID === CONSTANTS.item.Silver_Bar || smithingItems[selectedSmith].itemID === CONSTANTS.item.Gold_Bar) && checkSummoningSynergyActive(17, 18, true, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, smithInterval, smithingItems[selectedSmith].smithingID)))
                                qtyToAdd *= 2;
                            let bankItem = addItemToBank(item, qtyToAdd);
                            if (!bankItem && !ignoreBankFull)
                                startSmithing(true);
                            else {
                                let preserveChance = calculateSkillPreservationChance(CONSTANTS.skill.Smithing, smithingItems[selectedSmith].smithingID, item);
                                if (!rollPercentage(preserveChance)) {
                                    let hasCape = false;
                                    if (equippedItems[CONSTANTS.equipmentSlot.Cape] === CONSTANTS.item.Smithing_Skillcape || equippedItems[CONSTANTS.equipmentSlot.Cape] === CONSTANTS.item.Max_Skillcape || equippedItems[CONSTANTS.equipmentSlot.Cape] === CONSTANTS.item.Cape_of_Completion)
                                        hasCape = true;
                                    for (let i = 0; i < smithReqCheck.length; i++) {
                                        updateItemInBank(smithReqCheck[i].bankID, items[item].smithReq[smithReqCheck[i].reqID].id, -getSmithingRecipeQty(smithingItems[selectedSmith].itemID, smithReqCheck[i].reqID, false));
                                    }
                                } else
                                    notifyPlayer(CONSTANTS.skill.Smithing, "You managed to preserve your resources", "info");
                                if (smithingItems[selectedSmith].itemID === CONSTANTS.item.Silver_Bar) {
                                    let goldQty = 1;
                                    if (checkSummoningSynergyActive(17, 18, false, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, smithInterval, smithingItems[selectedSmith].smithingID)))
                                        goldQty *= 2;
                                    if (rollPercentage(playerModifiers.increasedSeeingGoldChance - playerModifiers.decreasedSeeingGoldChance))
                                        addItemToBank(CONSTANTS.item.Gold_Bar, goldQty);
                                    if (herbloreBonuses[11].bonus[0] === 0 && herbloreBonuses[11].charges > 0)
                                        updateHerbloreBonuses(herbloreBonuses[11].itemID);
                                }
                                let xpToAdd = items[item].smithingXP;
                                if (glovesTracker[2].isActive && glovesTracker[2].remainingActions > 0 && equippedItems[CONSTANTS.equipmentSlot.Gloves] === CONSTANTS.item.Smithing_Gloves) {
                                    xpToAdd = xpToAdd * 1.5;
                                    glovesTracker[2].remainingActions--;
                                    updateGloves(2, CONSTANTS.skill.Smithing);
                                }
                                if (playerModifiers.summoningSynergy_17_19 > 0)
                                    checkSummoningSynergyActive(17, 19, true, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, smithInterval, smithingItems[selectedSmith].smithingID));
                                else
                                    checkSummoningSynergyActive(10, 17, true, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, smithInterval, smithingItems[selectedSmith].smithingID));
                                addXP(CONSTANTS.skill.Smithing, xpToAdd);
                                addMasteryXP(CONSTANTS.skill.Smithing, smithingItems[selectedSmith].smithingID, smithInterval);
                                rollForPet(5, smithInterval);
                                rollForPet(21, smithInterval * (1 + getMasteryPoolProgress(CONSTANTS.skill.Smithing) / 100), false, CONSTANTS.skill.Smithing);
                                if (smithingItems[selectedSmith].smithingID < 9)
                                    statsSmithing[0].count++;
                                else
                                    statsSmithing[1].count++;
                                dropRingHalfA(smithingItems[selectedSmith].smithingLevel);
                                rollAllPossibleSummoningMarks(CONSTANTS.skill.Smithing, 2000, smithInterval);
                                statsSmithing[2].count += smithInterval / 1000;
                                updateStats("smithing");
                                updateSkillWindow(CONSTANTS.skill.Smithing);
                                isSmithing = false;
                                $("#skill-nav-name-5").removeClass("text-success");
                                updateSmithQty(item);
                                startSmithing();
                            }
                        }
                    }, smithInterval);
                }
            }
        }
    }
}
function selectSmith(smithingID, update=false) {
    if (tooltipInstances.smithing !== undefined) {
        tooltipInstances.smithing.forEach((instance)=>{
            instance.destroy();
        }
        );
    } else
        tooltipInstances.smithing = [];
    tooltipInstances.smithing.length = 0;
    if (isSmithing && !update)
        startSmithing(true);
    selectedSmith = smithingID;
    let itemID = smithingItems[smithingID].itemID;
    $("#smith-item-name").text(items[itemID].name);
    $("#smith-item-img").attr("src", getItemMedia(itemID));
    if (items[itemID].description != undefined) {
        $("#smith-item-desc").text(items[itemID].description);
    } else {
        $("#smith-item-desc").text("");
    }
    let itemQty = 0;
    let itemProduceQty = 0;
    $("#smith-item-reqs").html("");
    $("#smith-item-have").html("");
    $("#smith-item-produce").html("");
    $("#smith-item-produce-current").html("");
    $("#smith-item-grants").html("");
    for (let i = 0; i < items[itemID].smithReq.length; i++) {
        let qtyRequired = getSmithingRecipeQty(itemID, i, false);
        $("#smith-item-reqs").append(createItemRecipeElement(items[itemID].smithReq[i].id, qtyRequired, "smith-item-reqs-" + i));
        itemQty = getBankQty(items[itemID].smithReq[i].id);
        let haveClass = "bg-primary";
        if (itemQty < qtyRequired)
            haveClass = "bg-danger";
        $("#smith-item-have").append(createItemRecipeElement(items[itemID].smithReq[i].id, itemQty, "smith-item-have-" + i, haveClass));
        const reqs = tippy("#smith-item-reqs-" + i, {
            content: '<div class="text-center">' + items[items[itemID].smithReq[i].id].name + "</div>",
            placement: "top",
            allowHTML: true,
            interactive: false,
            animation: false,
        });
        tooltipInstances.smithing = tooltipInstances.smithing.concat(reqs);
        const reqs2 = tippy("#smith-item-have-" + i, {
            content: '<div class="text-center">' + items[items[itemID].smithReq[i].id].name + "</div>",
            placement: "top",
            allowHTML: true,
            interactive: false,
            animation: false,
        });
        tooltipInstances.smithing = tooltipInstances.smithing.concat(reqs2);
    }
    itemProduceQty = getBankQty(itemID);
    $("#smith-item-produce-current").text(numberWithCommas(itemProduceQty));
    let smithQty = 1;
    if (items[smithingItems[smithingID].itemID].smithingQty != undefined) {
        smithQty = items[smithingItems[smithingID].itemID].smithingQty;
    }
    $("#smith-item-produce").append(createItemRecipeElement(itemID, smithQty, "smith-item-produce-" + selectedSmith));
    $("#smith-item-grants").append(createItemRecipeElement(-1, Math.floor(getSkillXPToAdd(CONSTANTS.skill.Smithing, items[itemID].smithingXP)), "smith-item-grants-xp-" + selectedSmith) + createItemRecipeElement(-2, Math.floor(getMasteryXpToAdd(CONSTANTS.skill.Smithing, smithingItems[selectedSmith].smithingID, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, 2000, smithingItems[selectedSmith].smithingID, false))), "smith-item-grants-mxp-" + selectedSmith) + createItemRecipeElement(-3, Math.floor(getMasteryXpToAddToPool(CONSTANTS.skill.Smithing, getMasteryXpToAdd(CONSTANTS.skill.Smithing, smithingItems[selectedSmith].smithingID, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, 2000, smithingItems[selectedSmith].smithingID, false)), false)), "smith-item-grants-mpxp-" + selectedSmith));
    $("#smith-item-stats").attr("onClick", "viewItemStats(" + itemID + ", false);");
    if (items[itemID].type !== "Bar" && items[itemID].type !== "Arrowtips" && items[itemID].type !== "Arrows" && items[itemID].type !== "Crossbow" && items[itemID].type !== "Javelin")
        $("#smith-item-stats").removeClass("d-none");
    else
        $("#smith-item-stats").addClass("d-none");
    $("#smith-item-buff-preservation-qty").text(Math.floor(calculateSkillPreservationChance(CONSTANTS.skill.Smithing, smithingItems[selectedSmith].smithingID, itemID, false)) + "%");
    $("#smith-item-buff-doubling-qty").text(Math.floor(calculateChanceToDouble(CONSTANTS.skill.Smithing, false, 0, selectedSmith, itemID, false)) + "%");
    updateMasteryProgress(CONSTANTS.skill.Smithing, smithingItems[selectedSmith].smithingID);
    const produce = tippy("#smith-item-produce-" + selectedSmith, {
        content: '<div class="text-center">' + items[itemID].name + "</div>",
        placement: "top",
        allowHTML: true,
        interactive: false,
        animation: false,
    });
    tooltipInstances.smithing = tooltipInstances.smithing.concat(produce);
    const produceXP = tippy("#smith-item-grants-xp-" + selectedSmith, {
        content: '<div class="text-center">' + Math.floor(getSkillXPToAdd(CONSTANTS.skill.Smithing, items[itemID].smithingXP)) + " Skill XP</div>",
        placement: "top",
        allowHTML: true,
        interactive: false,
        animation: false,
    });
    tooltipInstances.smithing = tooltipInstances.smithing.concat(produceXP);
    const produceMXP = tippy("#smith-item-grants-mxp-" + selectedSmith, {
        content: '<div class="text-center">' + Math.floor(getMasteryXpToAdd(CONSTANTS.skill.Smithing, smithingItems[selectedSmith].smithingID, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, 2000, smithingItems[selectedSmith].smithingID, false))) + " Mastery XP</div>",
        placement: "top",
        allowHTML: true,
        interactive: false,
        animation: false,
    });
    tooltipInstances.smithing = tooltipInstances.smithing.concat(produceMXP);
    const produceMPXP = tippy("#smith-item-grants-mpxp-" + selectedSmith, {
        content: '<div class="text-center">' + Math.floor(getMasteryXpToAddToPool(CONSTANTS.skill.Smithing, getMasteryXpToAdd(CONSTANTS.skill.Smithing, smithingItems[selectedSmith].smithingID, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, 2000, smithingItems[selectedSmith].smithingID, false)), false)) + " Mastery Pool XP</div>",
        placement: "top",
        allowHTML: true,
        interactive: false,
        animation: false,
    });
    tooltipInstances.smithing = tooltipInstances.smithing.concat(produceMPXP);
    $("#skill-smithing-interval-icon").removeClass("d-none");
    $("#skill-smithing-interval").text(calculateSkillInterval(CONSTANTS.skill.Smithing, 2000, smithingItems[selectedSmith].smithingID, false) / 1000 + "s");
}
function loadSmithing() {
    let sTiers = ["bar", "bronze", "iron", "steel", "mithril", "adamant", "rune", "dragon"];
    smithingItems.sort(function(a, b) {
        return a.smithingLevel - b.smithingLevel;
    });
    smithingSorted.sort(function(a, b) {
        return a.smithingLevel - b.smithingLevel;
    });
    smithingSorted.sort(function(a, b) {
        return a.category - b.category;
    });
    let smithing = "";
    for (let i = 0; i < sTiers.length; i++) {
        smithing += '<div id="smithing-category-' + i + '" class="col-12 col-md-8 d-none">';
        smithing += '<div class="block-content">';
        smithing += '<div class="row">';
        let smithID;
        for (let f = 0; f < smithingItems.length; f++) {
            smithID = smithingItems[f].smithingID;
            if (smithingItems[f].category === i) {
                smithing += '<div id="smithing-item-' + f + '" class="col-12 col-md-6">';
                smithing += '<ul class="nav nav-pills nav-justified push">';
                smithing += '<li class="nav-item mr-1" id="smith-item-content-' + f + '">';
                smithing += "</li>";
                smithing += "</ul>";
                smithing += "</div>";
            }
        }
        smithing += "</div>";
        smithing += "</div>";
        smithing += "</div>";
    }
    $("#smithing-category-container").append(smithing);
    $("#smithing-category-0").removeClass("d-none");
    updateSmithing();
}
function updateSmithing() {
    setTimeout(function() {
        if (tooltipInstances.smithingRecipe !== undefined) {
            tooltipInstances.smithingRecipe.forEach((instance)=>{
                instance.destroy();
            }
            );
        } else
            tooltipInstances.smithingRecipe = [];
        tooltipInstances.smithingRecipe.length = 0;
        for (let i = 0; i < smithingItems.length; i++) {
            let tooltip = "";
            if (skillLevel[CONSTANTS.skill.Smithing] >= smithingItems[i].smithingLevel) {
                tooltip = "<div class=\"text-center\"><small class='text-warning'>Requires:</small><br>";
                for (let f = 0; f < items[smithingItems[i].itemID].smithReq.length; f++) {
                    tooltip += items[smithingItems[i].itemID].smithReq[f].qty + " <img class='skill-icon-xs mr-2' src='" + getItemMedia(items[smithingItems[i].itemID].smithReq[f].id) + "'>";
                }
                tooltip += "</div>";
                $("#smith-item-content-" + i).html('<a class="nav-link border" href="#" onClick="selectSmith(' + i + '); return false;"><img class="skill-icon-xs mr-2" src="' + getItemMedia(smithingItems[i].itemID) + '">' + items[smithingItems[i].itemID].name + "</a>");
                let t = tippy("#smith-item-content-" + i, {
                    content: tooltip,
                    placement: "top",
                    allowHTML: true,
                    interactive: false,
                    animation: false,
                });
                tooltipInstances.smithingRecipe = tooltipInstances.smithingRecipe.concat(t);
            } else {
                $("#smith-item-content-" + i).html('<span class="nav-link font-size-sm border border-danger">Unlocked at <img class="skill-icon-xs mr-1" src="' + CDNDIR + 'assets/media/skills/smithing/smithing.svg"> Level ' + smithingItems[i].smithingLevel + "</span>");
            }
        }
        updateTooltips();
    }, 50);
}
function updateSmithQty(itemID) {
    let itemQty = 0;
    for (let i = 0; i < items[itemID].smithReq.length; i++) {
        itemQty = getBankQty(items[itemID].smithReq[i].id);
        let recipeQty = getSmithingRecipeQty(itemID, i, false);
        if (recipeQty > itemQty)
            updateItemRecipeBorder("smith-item-have-" + i, false);
        else
            updateItemRecipeBorder("smith-item-have-" + i, true);
        $("#smith-item-have-" + i + "-qty").text(formatNumber(itemQty));
    }
    let itemProduceQty = 0;
    itemProduceQty = getBankQty(itemID);
    $("#smithing-item-have-current").text(formatNumber(itemProduceQty));
}
function smithCategory(cat) {
    for (let i = 0; i < 8; i++) {
        $("#smithing-category-" + i).addClass("d-none");
    }
    $("#smithing-category-" + cat).removeClass("d-none");
}
function getSmithingRecipeQty(itemID, recipeIndex, useCharges=true) {
    let qty = items[itemID].smithReq[recipeIndex].qty;
    if (items[itemID].smithReq[recipeIndex].id === CONSTANTS.item.Coal_Ore && (equippedItems.includes(CONSTANTS.item.Smithing_Skillcape) || equippedItems.includes(CONSTANTS.item.Max_Skillcape) || equippedItems.includes(CONSTANTS.item.Cape_of_Completion)))
        qty /= 2;
    if (items[itemID].smithReq[recipeIndex].id === CONSTANTS.item.Coal_Ore && checkSummoningSynergyActive(17, 19, useCharges, getTimePerActionModifierMastery(CONSTANTS.skill.Smithing, 1000, items[itemID].masteryID[1])))
        qty -= playerModifiers.summoningSynergy_17_19;
    if (qty < 1)
        qty = 1;
    return qty;
}
function checkSmithingReq(itemID, ignoreCoal=false) {
    if (itemID !== undefined) {
        if (itemID !== null) {
            smithReqCheck = [];
            for (let i = 0; i < items[itemID].smithReq.length; i++) {
                if (!ignoreCoal) {
                    smithReqCheck.push({
                        reqID: 0,
                        bankID: 0,
                        check: 0,
                        qty: 0
                    });
                    let qtyRequired = getSmithingRecipeQty(itemID, i, false);
                    const bankID = getBankId(items[itemID].smithReq[i].id);
                    if (bankID >= 0 && bank[bankID].qty >= qtyRequired) {
                        smithReqCheck[i].reqID = i;
                        smithReqCheck[i].bankID = bankID;
                        smithReqCheck[i].check = 1;
                        smithReqCheck[i].itemID = items[itemID].smithReq[i].id;
                        smithReqCheck[i].qty = qtyRequired;
                    }
                } else if (items[itemID].smithReq[i].id !== CONSTANTS.item.Coal_Ore) {
                    smithReqCheck.push({
                        reqID: 0,
                        bankID: 0,
                        check: 0
                    });
                    let qtyRequired = getSmithingRecipeQty(itemID, i, false);
                    const bankID = getBankId(items[itemID].smithReq[i].id);
                    if (bankID >= 0 && bank[bankID].qty >= qtyRequired) {
                        smithReqCheck[i].reqID = i;
                        smithReqCheck[i].bankID = bankID;
                        smithReqCheck[i].check = 1;
                        smithReqCheck[i].qty = qtyRequired;
                        smithReqCheck[i].itemID = items[itemID].smithReq[i].id;
                    }
                }
            }
            smithReqCheck.sort(function(a, b) {
                return b.bankID - a.bankID;
            });
            for (let i = 0; i < smithReqCheck.length; i++) {
                if (smithReqCheck[i].check !== 1) {
                    return false;
                }
            }
            return true;
        } else
            return false;
    } else
        return false;
}
