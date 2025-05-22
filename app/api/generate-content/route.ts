import { NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"
export const maxDuration = 600 // Doubled duration to handle much more content

export async function POST(req: Request) {
  try {
    const {
      url,
      platform,
      briefing,
      targetAudienceAge,
      targetAudienceInterests,
      targetAudienceNeeds,
      communicationTone,
    } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Search for latest trends if available
    let trendsContext = ""
    try {
      // First, determine what trends we need to search for based on the URL and platforms
      const trendSearchPrompt = `Based on the website ${url}, what are the top 3 specific trends I should search for to create content for Instagram, Facebook, YouTube, and LinkedIn? Format your response as a JSON array with just the search terms, no explanations.`
      
      const trendSearchResponse = await openai.chat.completions.create({
        model: "gpt-4o-2024-11-20",
        messages: [{ role: "user", content: trendSearchPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 500,
      })
      
      const searchTerms = JSON.parse(trendSearchResponse.choices[0].message.content || "{}")
      
      // Now search for each trend and compile the results
      if (searchTerms && searchTerms.searchTerms && Array.isArray(searchTerms.searchTerms)) {
        let trendResults = []
        
        for (const term of searchTerms.searchTerms) {
          // Get current trending music for Instagram if relevant
          if (term.toLowerCase().includes("music") || term.toLowerCase().includes("instagram") || term.toLowerCase().includes("tiktok")) {
            const musicSearchResponse = await openai.chat.completions.create({
              model: "gpt-4o-2024-11-20",
              messages: [{ role: "user", content: `What are the current top 5 trending songs on Instagram and TikTok? Just list the songs and artists, no explanations.` }],
              temperature: 0.7,
              max_tokens: 500,
            })
            trendResults.push(`Current trending music for Instagram/TikTok: ${musicSearchResponse.choices[0].message.content}`)
          }
          
          // Get trend information for the specific term
          const trendResponse = await openai.chat.completions.create({
            model: "gpt-4o-2024-11-20",
            messages: [{ role: "user", content: `What are the latest trends in "${term}" for content creation? Provide a brief summary.` }],
            temperature: 0.7,
            max_tokens: 500,
          })
          trendResults.push(`Latest trends for "${term}": ${trendResponse.choices[0].message.content}`)
        }
        
        trendsContext = "CURRENT TRENDS RESEARCH:\n" + trendResults.join("\n\n") + "\n\nUse the above trends research to inform your content creation and ensure it's current and relevant. Incorporate trending music, formats, and themes where appropriate."
      }
    } catch (searchError) {
      console.log("Error searching for trends:", searchError)
      // Continue even if trend search fails
      trendsContext = "Note: Unable to search for current trends. Use your existing knowledge to suggest trending content."
    }

    // Prepare the prompt with additional fields if provided
    let additionalContext = ""
    if (briefing) additionalContext += `Briefing: ${briefing}\n`
    if (targetAudienceAge) additionalContext += `Target Audience Age: ${targetAudienceAge}\n`
    if (targetAudienceInterests) additionalContext += `Target Audience Interests: ${targetAudienceInterests}\n`
    if (targetAudienceNeeds) additionalContext += `Target Audience Needs: ${targetAudienceNeeds}\n`
    if (communicationTone) additionalContext += `Communication Tone: ${communicationTone}\n`

    // Create the system message
    const systemPrompt = `You are a professional content strategist and social media manager. Analyze the website at ${url} and generate tailored content ideas for ${platform || "all social media platforms"}.

${additionalContext}

${trendsContext}

Your task:
1. Analyze the website to understand the brand's voice, offerings, and target audience.
2. Based on this analysis, create a detailed content strategy for ${platform || "Instagram, Facebook, YouTube, and LinkedIn"}.
3. For each platform, generate EXACTLY 6 distinct and diverse content ideas that align with the brand's identity and goals. This is a CRITICAL requirement - you MUST create 6 ideas for each platform, not more, not less.
4. Include creative elements and strategic recommendations.
5. EXTREMELY IMPORTANT: Provide exceptionally detailed content for each idea. Every idea must include comprehensive design details with COMPLETE shot lists, technical specifications, and designer notes. These should be extremely thorough with multiple paragraphs of detail.
6. Ensure each platform's content leverages the unique features of that platform and incorporates current trends.

If a specific platform is requested (${platform}), focus solely on that platform but still provide EXACTLY 6 ideas with maximum detail for each.

THE EXACT BREAKDOWN REQUIRED:
- Instagram: EXACTLY 6 detailed ideas
- Facebook: EXACTLY 6 detailed ideas
- YouTube: EXACTLY 6 detailed ideas
- LinkedIn: EXACTLY 6 detailed ideas

Return your response in a JSON format with the following structure:
{
  "brandAnalysis": {
    "name": "Brand Name",
    "domain": "domain.com",
    "personality": "Detailed description of brand voice/personality",
    "tone": "Formal/casual/etc.",
    "focus": "Main product/service focus"
  },
  "content": {
    "instagram": {
      "brief": "Comprehensive strategy for Instagram",
      "detailed": {
        "focus": "Key focus area for Instagram",
        "ideas": [
          {
            "title": "Content idea title",
            "visual": "Detailed visual concept description",
            "caption": "Full suggested caption with hashtags",
            "contentType": "reel or post",
            "duration": "For reels (e.g., 15-30 seconds)",
            "musicOptions": ["Trending song 1 - Artist", "Trending song 2 - Artist"],
            "designDetails": {
              "visualElements": ["Element 1 with detail", "Element 2 with detail", "Element 3 with detail"],
              "technicalSpecs": ["Spec 1: Full description", "Spec 2: Full description", "Aspect Ratio: 9:16", "Resolution: 1080x1920", "Frame Rate: 30fps", "Color Palette: specific colors"],
              "shotList": ["Shot 1: Extremely detailed description", "Shot 2: Extremely detailed description", "Shot 3: Extremely detailed description", "Shot 4: Extremely detailed description"],
              "designerNotes": "Comprehensive notes for design approach, style guidance, and implementation tips including fonts, colors, and visual style"
            }
          }
          // Repeat for all 6 ideas
        ],
        "stats": {
          "engagementRate": "Estimated engagement rate",
          "bestContentType": "Best performing content type",
          "optimalPosting": "Optimal posting time",
          "averageViewDuration": "Average view duration for video content",
          "bestVideoType": "Best performing video type"
        },
        "contentMix": {
          "categories": ["Category 1", "Category 2", "Category 3", "Category 4"],
          "formats": ["Format 1", "Format 2", "Format 3", "Format 4"]
        }
      }
    },
    "facebook": {
      "brief": "Comprehensive strategy for Facebook",
      "detailed": {
        "focus": "Key focus area for Facebook",
        "ideas": [
          {
            "title": "Content idea title",
            "content": "Full post content with engaging text",
            "callToAction": "Detailed call to action",
            "designDetails": {
              "visualElements": ["Element 1 with detail", "Element 2 with detail", "Element 3 with detail"],
              "technicalSpecs": ["Spec 1: Full description", "Spec 2: Full description", "Aspect Ratio: 16:9", "Resolution: 1200x628", "Color Profile: sRGB"],
              "shotList": ["Shot 1: Extremely detailed description", "Shot 2: Extremely detailed description", "Shot 3: Extremely detailed description"],
              "designerNotes": "Comprehensive notes for design approach, style guidance, and implementation tips including fonts, colors, and visual style"
            }
          }
          // Repeat for all 6 ideas
        ],
        "stats": {
          "engagementRate": "Estimated engagement rate",
          "clickThroughRate": "Estimated click-through rate",
          "optimalPosting": "Optimal posting time",
          "bestContentType": "Best performing content type"
        },
        "contentMix": {
          "categories": ["Category 1", "Category 2", "Category 3", "Category 4"],
          "formats": ["Format 1", "Format 2", "Format 3", "Format 4"]
        }
      }
    },
    "youtube": {
      "brief": "Comprehensive strategy for YouTube",
      "detailed": {
        "focus": "Key focus area for YouTube",
        "ideas": [
          {
            "title": "Content idea title",
            "format": "Detailed video format description",
            "productionNotes": "Comprehensive production suggestions",
            "outline": "Detailed video outline with sections",
            "contentType": "shorts or long-form",
            "duration": "Suggested duration",
            "designDetails": {
              "visualElements": ["Element 1 with detail", "Element 2 with detail", "Element 3 with detail", "Key visual themes with descriptions"],
              "technicalSpecs": ["Spec 1: Full description", "Spec 2: Full description", "Aspect Ratio: 16:9", "Resolution: 1920x1080", "Audio Quality: 48kHz stereo", "Lighting: detailed requirements"],
              "shotList": ["Shot 1: Extremely detailed description", "Shot 2: Extremely detailed description", "Shot 3: Extremely detailed description", "Shot 4: Extremely detailed description", "Shot 5: Extremely detailed description"],
              "designerNotes": "Comprehensive notes for visual style, editing approach, and production techniques including transitions, effects, and graphics"
            }
          }
          // Repeat for all 6 ideas
        ],
        "stats": {
          "averageViewDuration": "Estimated average view duration",
          "clickThroughRate": "Estimated click-through rate",
          "subscriberConversion": "Estimated subscriber conversion rate",
          "bestVideoType": "Best performing video type",
          "optimalLength": "Optimal video length"
        },
        "contentMix": {
          "categories": ["Category 1", "Category 2", "Category 3", "Category 4"],
          "formats": ["Format 1", "Format 2", "Format 3", "Format 4"]
        }
      }
    },
    "linkedin": {
      "brief": "Comprehensive strategy for LinkedIn",
      "detailed": {
        "focus": "Key focus area for LinkedIn",
        "ideas": [
          {
            "title": "Content idea title",
            "content": "Full post content with professional tone",
            "dataPoints": "Detailed key data points to include",
            "trendAnalysis": "In-depth analysis of industry trends",
            "conclusion": "Comprehensive concluding thoughts",
            "callToAction": "Professional call to action",
            "designDetails": {
              "visualElements": ["Element 1 with detail", "Element 2 with detail", "Element 3 with detail", "Professional graphic elements with descriptions"],
              "technicalSpecs": ["Spec 1: Full description", "Spec 2: Full description", "Aspect Ratio: 1200x627", "Format: PNG or PDF for documents", "Color Profile: sRGB"],
              "shotList": ["Shot/Section 1: Extremely detailed description", "Shot/Section 2: Extremely detailed description", "Shot/Section 3: Extremely detailed description"],
              "designerNotes": "Comprehensive notes about professional styling, branding consistency, and corporate design elements including typography, color scheme, and layout"
            }
          }
          // Repeat for all 6 ideas
        ],
        "stats": {
          "engagementRate": "Estimated engagement rate",
          "impressions": "Estimated impressions",
          "clickThroughRate": "Estimated click-through rate",
          "leadGeneration": "Estimated lead generation potential",
          "optimalPosting": "Optimal posting time"
        },
        "contentMix": {
          "categories": ["Category 1", "Category 2", "Category 3", "Category 4"],
          "formats": ["Format 1", "Format 2", "Format 3", "Format 4"]
        }
      }
    }
  }
}`

    // Make the API request using chat completions API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-11-20",
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 32000, // Greatly increased token limit to handle extremely detailed content
    })

    // Parse the JSON response
    let jsonResponse
    try {
      jsonResponse = JSON.parse(response.choices[0].message.content || "{}")
    } catch (parseError: any) {
      console.error("Error parsing JSON response:", parseError)
      console.log("Raw response:", response.choices[0].message.content)
      return NextResponse.json({ error: "Failed to parse API response" }, { status: 500 })
    }

    return NextResponse.json(jsonResponse)
  } catch (error: any) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
