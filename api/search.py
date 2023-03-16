import pandas as pd

import gspread

# "https://docs.google.com/spreadsheets/d/1hGM3mFYh735nSGYMVJQqIFVVxY9ZIlhYLvS69RR6fJY/edit#gid=855351030"

def configure_google_sheet(url : str):
    gc = gspread.service_account("./creds.json")
    sheet_url = url
    sheet = gc.open_by_url(sheet_url)
    worksheet = sheet.sheet1    
    return worksheet

def do_search(item : int, worksheet):
    data_frame = pd.DataFrame(worksheet.get_all_records())
    data = data_frame[data_frame["Card Number"] == item].to_dict()
    return data
    