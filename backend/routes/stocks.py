from fastapi import APIRouter, HTTPException, status
import os
import httpx

router = APIRouter(prefix="/stocks", tags=["Stocks"])

FINNHUB_API_KEY = os.environ.get('FINNHUB_API_KEY', '')

@router.get("/quote/{symbol}")
async def get_stock_quote(symbol: str):
    """Get real-time stock quote from Finnhub"""
    if not FINNHUB_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Finnhub API key not configured"
        )
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://finnhub.io/api/v1/quote",
                params={"symbol": symbol, "token": FINNHUB_API_KEY}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to fetch stock data"
                )
            
            data = response.json()
            
            return {
                "symbol": symbol,
                "currentPrice": data.get('c', 0),
                "change": data.get('d', 0),
                "percentChange": data.get('dp', 0),
                "high": data.get('h', 0),
                "low": data.get('l', 0),
                "open": data.get('o', 0),
                "previousClose": data.get('pc', 0)
            }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching stock data: {str(e)}"
        )

@router.get("/search")
async def search_stocks(query: str):
    """Search for stocks by name or symbol"""
    if not FINNHUB_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Finnhub API key not configured"
        )
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://finnhub.io/api/v1/search",
                params={"q": query, "token": FINNHUB_API_KEY}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to search stocks"
                )
            
            data = response.json()
            return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching stocks: {str(e)}"
        )

@router.get("/trending")
async def get_trending_stocks():
    """Get trending/popular stocks"""
    # Return a curated list of popular stocks for demo
    popular_symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX']
    
    if not FINNHUB_API_KEY:
        # Return mock data if no API key
        return {
            "trending": [
                {"symbol": symbol, "name": symbol, "price": 100.0, "change": 2.5}
                for symbol in popular_symbols
            ]
        }
    
    try:
        trending = []
        async with httpx.AsyncClient() as client:
            for symbol in popular_symbols:
                try:
                    response = await client.get(
                        f"https://finnhub.io/api/v1/quote",
                        params={"symbol": symbol, "token": FINNHUB_API_KEY}
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        trending.append({
                            "symbol": symbol,
                            "price": data.get('c', 0),
                            "change": data.get('d', 0),
                            "percentChange": data.get('dp', 0)
                        })
                except Exception:
                    continue
        
        return {"trending": trending}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching trending stocks: {str(e)}"
        )


