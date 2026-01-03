"use client"

import { Idea } from "@/types/idea-storm"
import { useUpdateIdea } from "@/hooks/useIdeaStorm"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function IdeaScores({ idea }: { idea: Idea }) {
    const updateIdea = useUpdateIdea()
    const [rice, setRice] = useState(idea.scores.rice)
    const [ice, setIce] = useState(idea.scores.ice)

    const handleSave = () => {
        updateIdea.mutate({
            id: idea.id,
            updates: { scores: { rice, ice } } // Scores logic in Service will fix totals
        })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {/* RICE Calculator */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        RICE Score
                        <span className="text-2xl font-bold text-primary">{idea.scores.rice.total}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ScoreSlider
                        label="Reach (Users/qtr)"
                        value={rice.reach}
                        onChange={(v: number) => setRice(p => ({ ...p, reach: v }))}
                        min={0} max={10000} step={100}
                    />
                    <ScoreSlider
                        label="Impact (0.25 - 3x)"
                        value={rice.impact}
                        onChange={(v: number) => setRice(p => ({ ...p, impact: v }))}
                        min={0.25} max={3} step={0.25}
                    />
                    <ScoreSlider
                        label="Confidence (%)"
                        value={rice.confidence}
                        onChange={(v: number) => setRice(p => ({ ...p, confidence: v }))}
                        min={0} max={100} step={5}
                    />
                    <ScoreSlider
                        label="Effort (Person-Months)"
                        value={rice.effort}
                        onChange={(v: number) => setRice(p => ({ ...p, effort: v }))}
                        min={0.5} max={12} step={0.5}
                    />
                    <Button variant="outline" className="w-full mt-4" onClick={handleSave}>Recalculate RICE</Button>
                </CardContent>
            </Card>

            {/* ICE Calculator */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        ICE Score
                        <span className="text-2xl font-bold text-blue-600">{idea.scores.ice.total}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ScoreSlider
                        label="Impact (1-10)"
                        value={ice.impact}
                        onChange={(v: number) => setIce(p => ({ ...p, impact: v }))}
                        min={1} max={10} step={1}
                    />
                    <ScoreSlider
                        label="Confidence (1-10)"
                        value={ice.confidence}
                        onChange={(v: number) => setIce(p => ({ ...p, confidence: v }))}
                        min={1} max={10} step={1}
                    />
                    <ScoreSlider
                        label="Ease (1-10)"
                        value={ice.ease}
                        onChange={(v: number) => setIce(p => ({ ...p, ease: v }))}
                        min={1} max={10} step={1}
                    />
                    <Button variant="outline" className="w-full mt-4" onClick={handleSave}>Recalculate ICE</Button>
                </CardContent>
            </Card>
        </div>
    )
}

function ScoreSlider({ label, value, onChange, min, max, step }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-sm">
                <Label>{label}</Label>
                <span className="font-mono text-muted-foreground">{value}</span>
            </div>
            <Slider
                value={[value]}
                onValueChange={([v]) => onChange(v)}
                min={min} max={max} step={step}
            />
        </div>
    )
}
