from telethon import TelegramClient
import asyncio
import random

# ==========================================
# 1. ADD YOUR API CREDENTIALS HERE
# ==========================================
# Replace these with the api_id and api_hash you get from my.telegram.org
API_ID = '37932008'
API_HASH = '652068ba14e98728c6ef7c794ee1a015'

# ==========================================
# 2. ADD YOUR TARGET GROUPS HERE
# ==========================================
# List the usernames (without the @ symbol) or invite links of the groups.
# NOTE: You MUST already be a member of these groups for the script to post!
TARGET_GROUPS = [
    'English_speaking_chatting',
    'English_National_Group',
    'English_Chatting_GC',
    'theenglishelevators'
]

# ==========================================
# 3. THE MESSAGE TEMPLATE
# ==========================================
MESSAGE_TEMPLATE = """🛑 Don't let your relatives get scammed by US mortgage hidden fees! 

Hey everyone 👋 

My relatives recently bought a house in the US and got completely blindsided by hidden fees (PMI, insane property taxes, escrow padding). 

The calculators online were all garbage and trying to sell them loans, so I spent the last few weeks coding a completely free, ad-free calculator for them. 

I just made it public for anyone else who needs it. Just type this into your browser:
👉 mortgagedash . app

✅ Calculates exact PMI drop-off dates
✅ Shows true affordability based on debt-to-income
✅ Fast, no ads, and completely free

If you have family in the US (or are planning to buy yourself), bookmark this. It will save you thousands. Feel free to share it around! 🙏"""

# ==========================================
# SCRIPT LOGIC (DO NOT CHANGE)
# ==========================================
client = TelegramClient('mortgagedash_session', API_ID, API_HASH)

async def main():
    print("🚀 Starting Telegram Auto-Poster...")
    
    for group in TARGET_GROUPS:
        try:
            print(f"⏳ Attempting to send message to: {group}...")
            
            # Send the message
            await client.send_message(group, MESSAGE_TEMPLATE, link_preview=True)
            print(f"✅ Successfully posted to: {group}")
            
            # Anti-Spam protection: Sleep for a random time between 2 to 5 minutes
            # DO NOT remove this sleep! If you post too fast, Telegram will ban your account.
            sleep_time = random.randint(120, 300)
            print(f"💤 Sleeping for {sleep_time} seconds before the next post to mimic human behavior...\n")
            await asyncio.sleep(sleep_time)
            
        except Exception as e:
            print(f"❌ Failed to post to {group}. Error: {e}\n")
            
    print("🎉 All done for this run! You can close the script.")

if __name__ == '__main__':
    with client:
        client.loop.run_until_complete(main())
