import gspread
# https://docs.google.com/spreadsheets/d/1hGM3mFYh735nSGYMVJQqIFVVxY9ZIlhYLvS69RR6fJY/edit#gid=855351030

def configure_google_sheet(url: str):    
    gc = gspread.service_account("./creds.json")

    sheet = gc.open_by_url(url=url)
    worksheet = sheet.sheet1
    return worksheet
def append_data(data : list, worksheet):    
    print(type(worksheet))
    try:
        worksheet.append_row(data)
        data[0] = ""
        worksheet.append_row(data)
    except Exception as e:
        return "An error occured!"
    return True