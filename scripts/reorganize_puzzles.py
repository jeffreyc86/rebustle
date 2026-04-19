#!/usr/bin/env python3
"""Reorganizes puzzle images: fixes cross-folder mismatches, renumbers sequentially."""
import os, shutil

BASE = "/Users/jeffrey/Projects/rebustle/public/puzzles"

def p(folder, num):
    return os.path.join(BASE, folder, f"{num:03d}.png")

def tmp(folder, tag):
    return os.path.join(BASE, folder, f"__tmp_{tag}.png")

# ── Step 1: Delete orphan files ───────────────────────────────────────────────
orphans = [
    ("common-phrase", "015"), ("common-phrase", "060"), ("common-phrase", "077"),
    ("common-phrase", "086"), ("common-phrase", "099"), ("common-phrase", "152"),
]
for folder, num in orphans:
    path = os.path.join(BASE, folder, f"{num}.png")
    if os.path.exists(path):
        os.remove(path)
        print(f"Deleted orphan: {folder}/{num}.png")

# ── Step 2: Move cross-folder files to temp names ────────────────────────────
cross = [
    # (src_folder, src_num, dst_folder, tmp_tag)
    ("thing",         "002", "common-phrase", "cp106"),   # HEAD IN THE CLOUDS
    ("thing",         "003", "common-phrase", "cp119"),   # ALL EARS
    ("thing",         "004", "common-phrase", "cp122"),   # FEELING UNDER THE WEATHER
    ("thing",         "022", "food",          "food025"), # MOUNTAIN DEW
    ("common-phrase", "112", "thing",         "th002"),   # SHOOTING STAR
    ("common-phrase", "125", "thing",         "th003"),   # HORSEPOWER
    ("common-phrase", "128", "thing",         "th004"),   # FIRST AID
    ("common-phrase", "176", "song",          "song002"), # IT'S A SMALL WORLD AFTERALL
    ("movie",         "011", "thing",         "th020"),   # GAME NIGHT
    ("music",         "029", "food",          "food024"), # MEATLOAF
]
for src_folder, src_num, dst_folder, tag in cross:
    src = os.path.join(BASE, src_folder, f"{src_num}.png")
    dst = tmp(dst_folder, tag)
    shutil.move(src, dst)
    print(f"Moved: {src_folder}/{src_num}.png → {dst_folder}/__tmp_{tag}.png")

# ── Step 3: Rename each folder's remaining files to temp names ────────────────
# common-phrase: existing files that STAY (not cross-moved, not deleted)
# Map: existing filename (str) → new sequential number (int)

cp_mapping = {
    "001":1,"002":2,"003":3,"004":4,"005":5,"006":6,"007":7,"008":8,"009":9,"010":10,
    "011":11,"012":12,"013":13,"014":14,
    # 015 deleted, 016→015
    "016":15,"017":16,"018":17,"019":18,"020":19,"021":20,"022":21,"023":22,"024":23,
    "025":24,"026":25,"027":26,"028":27,"029":28,"030":29,"031":30,"032":31,"033":32,
    "034":33,"035":34,"036":35,"037":36,"038":37,"039":38,"040":39,"041":40,
    # 042 doesn't exist, 043→041
    "043":41,"044":42,"045":43,"046":44,"047":45,"048":46,"049":47,"050":48,
    "051":49,"052":50,"053":51,"054":52,"055":53,"056":54,"057":55,"058":56,"059":57,
    # 060 deleted, 061→58
    "061":58,"062":59,"063":60,"064":61,"065":62,
    # 066 doesn't exist, 067→63
    "067":63,"068":64,"069":65,"070":66,"071":67,"072":68,"073":69,"074":70,"075":71,
    "076":72,
    # 077 deleted, 078→73
    "078":73,"079":74,"080":75,"081":76,"082":77,"083":78,"084":79,"085":80,
    # 086 deleted, 087→81
    "087":81,"088":82,"089":83,"090":84,"091":85,"092":86,"093":87,"094":88,"095":89,
    "096":90,"097":91,"098":92,
    # 099 deleted, 100→93
    "100":93,"101":94,"102":95,"103":96,"104":97,"105":98,"106":99,"107":100,"108":101,
    "109":102,"110":103,"111":104,
    # 112 moved out, 113→105
    "113":105,
    # tmp_cp106 inserted here (thing/002 → new 106)
    "114":107,"115":108,"116":109,"117":110,"118":111,"119":112,"120":113,"121":114,
    "122":115,"123":116,"124":117,
    # 125 moved out, 126→118
    "126":118,
    # tmp_cp119 inserted here (thing/003 → new 119)
    "127":120,
    # 128 moved out, 129→121
    "129":121,
    # tmp_cp122 inserted here (thing/004 → new 122)
    "130":123,"131":124,"132":125,"133":126,"134":127,"135":128,"136":129,
    # 137 doesn't exist
    "138":130,"139":131,"140":132,"141":133,
    # 142 doesn't exist
    "143":134,"144":135,"145":136,"146":137,"147":138,"148":139,"149":140,
    # 150,151 don't exist; 152 deleted
    "153":141,"154":142,"155":143,"156":144,"157":145,"158":146,"159":147,"160":148,
    "161":149,"162":150,"163":151,"164":152,"165":153,"166":154,"167":155,"168":156,
    # 169 doesn't exist
    "170":157,"171":158,
    # 172 doesn't exist
    "173":159,"174":160,"175":161,
    # 176 moved out
    # 177 doesn't exist
    "178":162,
    # 179,180 don't exist
    "181":163,
    # 182 doesn't exist
    "183":164,"184":165,"185":166,"186":167,"187":168,"188":169,"189":170,"190":171,
    "191":172,"192":173,"193":174,"194":175,"195":176,"196":177,"197":178,"198":179,
    "199":180,"200":181,"201":182,"202":183,"203":184,"204":185,"205":186,"206":187,
    "207":188,"208":189,
    # 209 doesn't exist
    "210":190,"211":191,"212":192,"213":193,"214":194,"215":195,"216":196,"217":197,
    "218":198,"219":199,"220":200,"221":201,"222":202,
    # 223 doesn't exist
    "224":203,"225":204,"226":205,"227":206,"228":207,
}
# tmp files coming in to common-phrase (already in right folder):
# __tmp_cp106 → 106, __tmp_cp119 → 119, __tmp_cp122 → 122

thing_mapping = {
    "001":1,
    # 002,003,004 moved out
    "005":5,
    # 006,007 don't exist
    "008":6,"009":7,"010":8,"011":9,"012":10,"013":11,"014":12,"015":13,"016":14,
    "017":15,"018":16,"019":17,"020":18,"021":19,
    # tmp_th020 (movie/011) → 20
    # 022 moved out; 023 doesn't exist
    "024":21,"025":22,"026":23,
    # 027 doesn't exist
    "028":24,"029":25,"030":26,"031":27,"032":28,"033":29,"034":30,
    # 035 doesn't exist
    "036":31,"037":32,"038":33,"039":34,"040":35,
    # 041 doesn't exist
    "042":36,"043":37,"044":38,"045":39,"046":40,
}
# tmp_th002(cp/112)→2, tmp_th003(cp/125)→3, tmp_th004(cp/128)→4, tmp_th020(movie/011)→20

food_mapping = {
    "001":1,"002":2,"003":3,"004":4,"005":5,"006":6,"007":7,"008":8,"009":9,"010":10,
    "011":11,"012":12,"013":13,"014":14,"015":15,"016":16,"017":17,"018":18,
    # 019 doesn't exist
    "020":19,"021":20,"022":21,"023":22,"024":23,
    # tmp_food024(music/029 MEATLOAF) → 24; tmp_food025(thing/022 MOUNTAIN DEW) → 25
    "026":26,"027":27,"028":28,"029":29,"030":30,"031":31,
}

music_mapping = {
    "001":1,
    # 002 doesn't exist
    "003":2,"004":3,"005":4,"006":5,"007":6,
    # 008 doesn't exist
    "009":7,
    # 010 doesn't exist
    "011":8,"012":9,
    # 013 doesn't exist
    "014":10,"015":11,"016":12,"017":13,"018":14,"019":15,"020":16,"021":17,"022":18,
    "023":19,
    # 024 doesn't exist
    "025":20,"026":21,"027":22,"028":23,
    # 029 moved out
    "030":24,
    # 031 doesn't exist
    "032":25,"033":26,"034":27,"035":28,"036":29,
}

movie_mapping = {
    "001":1,"002":2,"003":3,"004":4,"005":5,"006":6,"007":7,"008":8,"009":9,"010":10,
    # 011 moved out
    # 022 doesn't exist
    "012":11,"013":12,"014":13,"015":14,"016":15,"017":16,"018":17,"019":18,"020":19,
    "021":20,"023":21,"024":22,"025":23,"026":24,"027":25,"028":26,"029":27,"030":28,
}

word_mapping = {
    "001":1,"002":2,"003":3,"004":4,
    # 005 doesn't exist
    "006":5,
    # 007 doesn't exist
    "008":6,"009":7,
    # 010 doesn't exist
    "011":8,
    # 012 doesn't exist
    "013":9,"014":10,
}

person_mapping = {
    "001":1,"002":2,"003":3,"004":4,
    # 005 doesn't exist
    "006":5,"007":6,"008":7,"009":8,
}

christmas_mapping = {
    "001":1,"002":2,"003":3,"004":4,"005":5,"006":6,"007":7,
    # 008 doesn't exist
    "009":8,"010":9,"011":10,"012":11,
}

# place and sport are already sequential, no changes needed

def rename_folder(folder, mapping, tmp_inserts=None):
    """Two-pass rename: first to temp, then to final."""
    folder_path = os.path.join(BASE, folder)

    # Pass 1: rename existing files to temp names
    for old_num_str, new_num in mapping.items():
        src = os.path.join(folder_path, f"{old_num_str}.png")
        if os.path.exists(src):
            dst = os.path.join(folder_path, f"__seq_{new_num:03d}.png")
            shutil.move(src, dst)

    # Rename cross-folder tmp files to their seq names
    if tmp_inserts:
        for tag, new_num in tmp_inserts.items():
            src = tmp(folder, tag)
            if os.path.exists(src):
                dst = os.path.join(folder_path, f"__seq_{new_num:03d}.png")
                shutil.move(src, dst)

    # Pass 2: rename __seq_NNN.png → NNN.png
    for fname in os.listdir(folder_path):
        if fname.startswith("__seq_") and fname.endswith(".png"):
            num_str = fname[len("__seq_"):-len(".png")]
            final = os.path.join(folder_path, f"{num_str}.png")
            shutil.move(os.path.join(folder_path, fname), final)

    print(f"Renamed {folder}: {len(mapping)} existing + {len(tmp_inserts or {})} incoming files")

rename_folder("common-phrase", cp_mapping, {"cp106": 106, "cp119": 119, "cp122": 122})
rename_folder("thing", thing_mapping, {"th002": 2, "th003": 3, "th004": 4, "th020": 20})
rename_folder("food", food_mapping, {"food024": 24, "food025": 25})
rename_folder("music", music_mapping)
rename_folder("movie", movie_mapping)
rename_folder("word", word_mapping)
rename_folder("person", person_mapping)
rename_folder("christmas-movie", christmas_mapping)

# song: just rename tmp to final
song_tmp = tmp("song", "song002")
if os.path.exists(song_tmp):
    shutil.move(song_tmp, p("song", 2))
    print("Renamed song: 002.png (IT'S A SMALL WORLD AFTERALL)")

# Verify
for folder in ["common-phrase","thing","food","music","movie","word","person","christmas-movie","song","place","sport"]:
    files = sorted(f for f in os.listdir(os.path.join(BASE, folder)) if f.endswith(".png"))
    print(f"{folder}: {len(files)} files → {files[0]} … {files[-1]}")
